import type { PageServerLoad } from './$types';

export const load = (async ({ params, fetch }) => {
  const { sessionID } = params;
  const response = await fetch(`/api/status/${sessionID}`).then((r) => r.json());

  let title, pageTitle, message;

  switch (response.payment_status) {
    case 'paid':
      title = 'Success.';
      pageTitle = 'Success';
      message = 'We have issued a request for your Sirius license to be added to your Discord account, this should only take a few minutes.';
      break;
    case 'unpaid':
      title = 'Canceled.';
      pageTitle = 'Canceled';
      message = "This order was canceled and you haven't been charged.";
      break;
    default:
      title = 'Payment status unknown.';
      pageTitle = 'Payment status unknown';
      message = 'Your payment status is unknown.';
      break;
  }

  return {
    props: {
      title,
      pageTitle,
      message
    }
  };
}) satisfies PageServerLoad;

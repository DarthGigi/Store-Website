import type { PageServerLoad } from './$types';
import { WHITELIST_URL, LUARMOR_PROJECT, LUARMOR_KEY } from '$env/static/private';

export const load = (async ({ params, fetch }) => {
  const { sessionID } = params;
  const response = await fetch(`/api/status/${sessionID}`).then((r) => r.json());

  let title, pageTitle, message, key, user;

  switch (response.payment_status) {
    case 'paid':
      user = response.metadata.Gift ?? response.metadata.DiscordID;
      title = 'Success.';
      pageTitle = 'Success';
      message = 'We have issued a request for your license to be added to your Discord account, this should only take a few minutes.';
      key = await fetch(`${WHITELIST_URL}/projects/${LUARMOR_PROJECT}/users?discord_id=${await user}`, {
        headers: {
          authorization: LUARMOR_KEY
        }
      }).then((res) => res.json());

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
      message,
      key
    }
  };
}) satisfies PageServerLoad;

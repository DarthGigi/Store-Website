interface ServicePrices {
  stripe: number | string;
  crypto: number | string;
  robux: number | string;
}
export interface IPlanPrices {
  [index: string]: ServicePrices;
  pro: ServicePrices;
  essential: ServicePrices;
  upgrade: ServicePrices;
}

export interface IChoice {
  PlanID: string;
  PaymentID: string;
}

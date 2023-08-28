interface ServicePrices {
  stripe: number | string;
  robux: number | string;
}
export interface IPlanPrices {
  [index: string]: ServicePrices;
  tier1: ServicePrices;
  tier2: ServicePrices;
  tier3: ServicePrices;
}

export interface IChoice {
  PlanID: string;
  PaymentID: string;
}

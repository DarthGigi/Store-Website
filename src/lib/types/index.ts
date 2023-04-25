interface ServicePrices {
    stripe: number,
    crypto: number,
    robux: number,
}
export interface IPlanPrices {
    [index: string]: ServicePrices
    pro: ServicePrices;
    essential: ServicePrices;
    upgrade: ServicePrices;
}

export interface IChoice {
    id: string;
    price: number;
};
export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";
type Prices = Record<ServiceType, Record<ServiceYear,number>>;

const IsServiceSelected = (services: ServiceType[], service: ServiceType) =>
    services.includes(service)

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    const { type, service } = action;

    switch(type) {
        case "Select": {
            const isServiceSelected = IsServiceSelected(previouslySelectedServices, service)
            const cannotAddBlurayPackageService = service === 'BlurayPackage' && !IsServiceSelected(previouslySelectedServices,'VideoRecording')

            if(isServiceSelected || cannotAddBlurayPackageService) {
                return previouslySelectedServices
            }

            return [...previouslySelectedServices, service]

        }
        case "Deselect":
            const cannotDeselect = !IsServiceSelected(previouslySelectedServices, service)
            if(cannotDeselect) {
                return previouslySelectedServices
            }

            if(service === 'Photography' && IsServiceSelected(previouslySelectedServices, 'VideoRecording')) {//Line 32 and 35 can be one condition
                return previouslySelectedServices.filter((s) => s !== service)
            }
            if(service === 'VideoRecording' && IsServiceSelected(previouslySelectedServices, 'Photography')) {
                return previouslySelectedServices.filter((s) => s !== service)
            }
            if(service === 'Photography' || service === 'VideoRecording') {
                return previouslySelectedServices.filter((s) => s !== service && s !== 'TwoDayEvent')
            }

            return previouslySelectedServices.filter((s) => s !== service)
        default:
          return previouslySelectedServices;
      }
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    const prices: Prices = {
            Photography: { 2020: 1700, 2021: 1800, 2022: 1900},
            VideoRecording: { 2020: 1700, 2021: 1800, 2022: 1900},
            WeddingSession: { 2020: 600, 2021: 600, 2022: 600},
            BlurayPackage: { 2020: 300, 2021: 300, 2022: 300 },
            TwoDayEvent: { 2020: 400, 2021: 400, 2022: 400 },
        }
const basePrice = selectedServices.reduce(
            (totalPrice, service) => totalPrice + prices[service][selectedYear], 0);

   if (selectedServices.includes("Photography") || selectedServices.includes("VideoRecording")) {
       prices.WeddingSession[2020] = 300;
       prices.WeddingSession[2021] = 300;
       prices.WeddingSession[2022] = 300;
   }

    if (selectedServices.includes("Photography") && selectedYear === 2022) {
        prices.WeddingSession[2022] = 0;
    }

    if (selectedServices.includes("Photography") && selectedServices.includes("VideoRecording")) {
        if(selectedYear === 2020) {
            prices.Photography[2020] = 1100;
            prices.VideoRecording[2020] = 1100;
        }
        if(selectedYear === 2021) {
            prices.Photography[2021] = 1150;
            prices.VideoRecording[2021] = 1150;
        }
        if(selectedYear === 2022) {
            prices.Photography[2022] = 1250;
            prices.VideoRecording[2022] = 1250;
        }
    }

    if (!selectedServices.includes("VideoRecording")) {
        delete prices.BlurayPackage;
        delete prices.TwoDayEvent;
      }

      if (!selectedServices.includes("Photography")) {
        delete prices.TwoDayEvent;
      }

    const finalPrice = selectedServices.reduce(
        (totalPrice, service) => totalPrice + prices[service][selectedYear], 0);

    return { basePrice, finalPrice }
};
//method above can be refactored because it has to many ifs in one method,
//I would refactor it on smaller method or in fluent way like 
// prices.ApplyWeddingDiscount()
//       .ApplyPhotographyDiscount() etc..

import axios from "axios";
// Function to calculate postage
export const calculateDeliveryFee = async (
  fromPostcode,
  toPostcode,
  dimensions,
  weight
) => {
  const postageTypesURL =
    "https://digitalapi.auspost.com.au/postage/parcel/domestic/service.json";

  // First, get available postage services
  const serviceParams = {
    from_postcode: fromPostcode,
    to_postcode: toPostcode,
    length: dimensions.length,
    width: dimensions.width,
    height: dimensions.height,
    weight: weight,
  };

  const serviceResponse = await axios.get(postageTypesURL, {
    headers: { "AUTH-KEY": process.env.AUSTRALIA_POST_API },
    params: serviceParams,
  });

  // Check for errors
  if (serviceResponse.status !== 200) {
    throw new Error(
      `Error fetching postage services: ${serviceResponse.statusText}`
    );
  }

  const services = serviceResponse.data.services.service;

  //   picking the cheapest service available
  const cheapestService = (function (services) {
    // Sort services by price in ascending order
    const sortedServices = services.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    );

    return sortedServices[0];
  })(services);

  const selectedServiceCode = cheapestService.code;

  // Now, calculate the total delivery price using the service code
  const calculateURL =
    "https://digitalapi.auspost.com.au/postage/parcel/domestic/calculate.json";

  const calculateParams = {
    from_postcode: fromPostcode,
    to_postcode: toPostcode,
    length: dimensions.length,
    width: dimensions.width,
    height: dimensions.height,
    weight: weight,
    service_code: selectedServiceCode,
  };

  const calculateResponse = await axios.get(calculateURL, {
    headers: { "AUTH-KEY": process.env.AUSTRALIA_POST_API },
    params: calculateParams,
  });

  // Check for errors
  if (calculateResponse.status !== 200) {
    throw new Error(
      `Error calculating delivery price: ${calculateResponse.statusText}`
    );
  }
  return calculateResponse.data.postage_result;
};

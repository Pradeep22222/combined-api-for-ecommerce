import express from "express";
import axios from "axios";

const router = express.Router();

// Endpoint to calculate delivery fee
router.post("/delivery-fee", async (req, res) => {
  try {
    const { fromPostcode, toPostcode, length, width, height, weight } =
      req.body;
    if (
      !fromPostcode ||
      !toPostcode ||
      !length ||
      !width ||
      !height ||
      !weight
    ) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const postageTypesURL =
      "https://digitalapi.auspost.com.au/postage/parcel/domestic/service.json";

    // Parameters for fetching available services
    const serviceParams = {
      from_postcode: fromPostcode,
      to_postcode: toPostcode,
      length: length,
      width: width,
      height: height,
      weight: weight,
    };

    // Request available services
    const serviceResponse = await axios.get(postageTypesURL, {
      headers: { "AUTH-KEY": process.env.AUSTRALIA_POST_API },
      params: serviceParams,
      
    });

    if (serviceResponse.status !== 200) {
      return res.status(serviceResponse.status).json({
        error: `Error fetching postage services: ${serviceResponse.statusText}`,
      });
    }

    const services = serviceResponse.data.services.service;



  

    // Picking the cheapest service
    const cheapestService = services.sort(
      (a, b) => parseFloat(a.price) - parseFloat(b.price)
    )[0];

    const selectedServiceCode = cheapestService.code;

    // Now calculate the total delivery price using the service code
    const calculateURL =
      "https://digitalapi.auspost.com.au/postage/parcel/domestic/calculate.json";

    const calculateParams = {
      from_postcode: fromPostcode,
      to_postcode: toPostcode,
      length: length,
      width: width,
      height: height,
      weight: weight,
      service_code: selectedServiceCode,
    };

    const calculateResponse = await axios.get(calculateURL, {
      headers: { "AUTH-KEY": process.env.AUSTRALIA_POST_API },
      params: calculateParams,
    });

    if (calculateResponse.status !== 200) {
      return res.status(calculateResponse.status).json({
        error: `Error calculating delivery price: ${calculateResponse.statusText}`,
      });
    }

    // Return the calculated postage result
    res.status(200).json(calculateResponse.data.postage_result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

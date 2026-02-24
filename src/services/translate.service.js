import axios from "axios";

export const SUPPORTED_LANG = {
  en: "English",
  es: "Spanish",
  it: "Italian",
  de: "German",
  fr: "French",
};

export const translateText = async (text, sourceLang, targetLang) => {
  try {
    const response = await axios.post(
      "https://api.flygrs.com/translate",
      {
        content: text,
        sourceLang,
        targetLang,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: "https://flygrs.com/",
        },
        timeout: 5000,
      }
    );

    return response.data?.response?.message?.content || text;
  } catch (error) {
    console.log("error", error);
    
  }
};

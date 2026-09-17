const gemini_url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent";

export const generateGeminiResponse = async (prompt) => {
    try {
        console.log("Sending request to Gemini...");

        const response = await fetch(
            `${gemini_url}?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        console.log("Gemini Status:", response.status);

        const responseText = await response.text();

        if (!response.ok) {
            console.log("Gemini Error:", responseText);
            throw new Error(
                `Gemini API failed with status ${response.status}: ${responseText}`
            );
        }

        const data = JSON.parse(responseText);

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("No text returned from Gemini");
        }

        console.log("Gemini response received");

        const cleanText = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        return JSON.parse(cleanText);

    } catch (error) {
        console.log("GEMINI ERROR:", error.message);
        throw error;
    }
};
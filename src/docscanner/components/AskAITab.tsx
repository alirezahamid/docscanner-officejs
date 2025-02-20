import React, { useState } from "react";
import { Button, Spinner, Card, Textarea } from "@fluentui/react-components";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractFullDocumentText } from "../docscanner";

const GEMINI_API_KEY = "AIzaSyClVrM1jIGnT1WJ4MQ9U6Gq-iACalC80gE";

const AskAITab = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchGeminiResponse = async () => {
    if (!userPrompt.trim()) {
      return;
    }

    setLoading(true);
    const selectedText = await extractFullDocumentText();

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        **Task**: Answer the user's question while preserving document formatting.
        - If text is **bold**, keep it bold.
        - If text is *italic*, keep it italic.
        - If text is __underlined__, keep it underlined.
        - Preserve numbered **lists** and **bullet points**.
        
        **User Prompt**: ${userPrompt}
        **Document Context**: ${selectedText}

        **Your response should match the input text's formatting.**
      `;

      const result = await model.generateContent(prompt);
      let responseText = result.response.text();

      setChatResponse(responseText);
    } catch (error) {
      setChatResponse("Error communicating with Gemini API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h3>Ask AI About the Document</h3>
      <Textarea
        placeholder="Enter your question..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        style={{ width: "100%", minHeight: "80px", marginBottom: "10px" }}
      />
      <Button onClick={fetchGeminiResponse} disabled={loading}>
        {loading ? <Spinner /> : "Submit"}
      </Button>
      {chatResponse && (
        <Card style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f3f3f3" }}>
          <h4>Response:</h4>
          <p dangerouslySetInnerHTML={{ __html: chatResponse }} />
        </Card>
      )}
    </Card>
  );
};

export default AskAITab;

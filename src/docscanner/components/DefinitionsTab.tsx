import React, { useState } from "react";
import { Button, Card } from "@fluentui/react-components";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { extractFullDocumentText, highlightText } from "../docscanner";

const GEMINI_API_KEY = "AIzaSyClVrM1jIGnT1WJ4MQ9U6Gq-iACalC80gE";

const DefinitionsTab = () => {
  const [definitions, setDefinitions] = useState<{ term: string; definition: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Send extracted text to Gemini API for definitions
  const scanLegalDocument = async () => {
    setLoading(true);
    const documentText = await extractFullDocumentText();

    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        **Task**: Extract all definitions from the following legal document.
        - Identify all **terms** and their corresponding **definitions**.
        - Terms are often enclosed in quotes (e.g., "Confidential Information").
        - Return results in a structured format: **Term - Definition**.

        **Legal Document:**
        ${documentText}

        **Extracted Definitions:**
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      // Process AI response into an array of definitions
      const extractedDefinitions = responseText
        .split("\n")
        .map((line) => {
          const parts = line.split(" - ");
          if (parts.length === 2) {
            return { term: parts[0].trim(), definition: parts[1].trim() };
          }
          return null;
        })
        .filter((item) => item !== null);

      setDefinitions(extractedDefinitions);
    } catch (error) {
      setDefinitions([{ term: "Error", definition: "Failed to retrieve definitions." }]);
    } finally {
      setLoading(false);
    }
  };

  const highlightDefinitionInWord = async (term: string) => {
    // Remove surrounding quotes and trim spaces for better matching
    const cleanedTerm = term.replace(/^"|"$/g, "").trim();

    try {
      await highlightText(cleanedTerm);
    } catch (error) {
      return error;
    }
  };

  return (
    <Card>
      <h3>Extract Legal Definitions</h3>
      <Button onClick={scanLegalDocument} disabled={loading}>
        {loading ? "Scanning..." : "Extract Definitions"}
      </Button>

      {definitions.length > 0 && (
        <Card style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f3f3f3" }}>
          <h4>Extracted Definitions:</h4>
          <ul>
            {definitions.map((def, index) => (
              <li
                key={index}
                onClick={() => highlightDefinitionInWord(def.term)}
                style={{ cursor: "pointer", color: "blue" }}
              >
                <strong>{def.term}:</strong> {def.definition}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </Card>
  );
};

export default DefinitionsTab;

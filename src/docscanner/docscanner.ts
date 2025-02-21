/* global Word console */

export const insertText = async (text: string) => {
  // Write text to the document.
  try {
    await Word.run(async (context) => {
      let body = context.document.body;
      body.insertParagraph(text, Word.InsertLocation.end);
      await context.sync();
    });
  } catch (error) {
    return error;
  }
};

export const extractFullDocumentText = async () => {
  try {
    return await Word.run(async (context) => {
      const body = context.document.body;
      body.load("text");
      await context.sync();
      return body.text || "No text available.";
    });
  } catch (error) {
    return "Error extracting text.";
  }
};

export const highlightText = async (term: string) => {
  try {
    await Word.run(async (context) => {
      const body = context.document.body;
      const searchResults = body.search(term, { matchCase: false, matchWholeWord: false });
      searchResults.load("items");
      await context.sync();

      if (searchResults.items.length > 0) {
        for (let i = 0; i < searchResults.items.length; i++) {
          searchResults.items[i].font.highlightColor = "yellow";
        }
        await context.sync();
      }
    });
    return;
  } catch (error) {
    return "Error extracting text.";
  }
};

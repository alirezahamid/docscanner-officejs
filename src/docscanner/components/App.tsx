import React, { useState } from "react";
import { FluentProvider, Tab, TabList, webLightTheme } from "@fluentui/react-components";
import Header from "./Header";
import AskAITab from "./AskAITab";
import DefinitionsTab from "./DefinitionsTab";

interface AppProps {
  title: string;
}

const App = (props: AppProps) => {
  const [selectedTab, setSelectedTab] = useState("ask-ai");
  const handleTabSelect = (_, data) => {
    setSelectedTab(data.value);
  };
  return (
    <FluentProvider theme={webLightTheme}>
      <Header logo="assets/logo-filled.png" title={props.title} message="Welcome" />
      <TabList selectedValue={selectedTab} onTabSelect={handleTabSelect}>
        <Tab value="ask-ai">Ask AI</Tab>
        <Tab value="definitions">Definitions</Tab>
      </TabList>

      {selectedTab === "ask-ai" && <AskAITab />}
      {selectedTab === "definitions" && <DefinitionsTab />}
    </FluentProvider>
  );
};

export default App;

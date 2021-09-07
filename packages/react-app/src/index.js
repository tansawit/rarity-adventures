import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import "./index.css";
import App from "./App.js";
import CharacterContextProvider from "./components/Context/CharacterContext";

// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/paulrberg/create-eth-app",
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <CharacterContextProvider>
      <App />
    </CharacterContextProvider>
  </ApolloProvider>,
  document.getElementById("root")
);

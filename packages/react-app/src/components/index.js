import styled from "styled-components"

export const Header = styled.header`
  background-color: #282c34;
  min-height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: white;
  & img {
    width: 100%;
    display: block;
    max-width: 100px;
  }
`

export const Body = styled.body`
  align-items: center;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: calc(100vh - 70px);
`

export const Image = styled.img`
  height: 40vmin;
  margin-bottom: 16px;
  pointer-events: none;
`

export const Link = styled.a.attrs({
  target: "_blank",
  rel: "noopener noreferrer",
})`
  color: #61dafb;
  margin-top: 10px;
`

export const Button = styled.button`
  background: #007580;
  border: 5px solid #d8ebe4;
  padding: 10px 15px;
  transition: 0.3s;
  cursor: pointer;
  &:hover,
  &active,
  &:focus {
    opacity: 0.8;
  }
  &:disabled {
    pointer-event: none;
    opacity: 0.5;
  }
`

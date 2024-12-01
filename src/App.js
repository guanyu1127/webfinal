import React, { useState } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { HiSwitchHorizontal } from "react-icons/hi";
import "./App.css";

function TravelAssistantApp() {
  // 旅遊主題
  const [themes, setThemes] = useState([]);
  const [currentTheme, setCurrentTheme] = useState("");
  const [newTheme, setNewTheme] = useState("");

  // 天氣
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({ data: {}, loading: false, error: false });

  // 貨幣匯率
  const [currencies] = useState(["TWD", "USD", "JPY", "KRW", "GBP", "EUR", "CNY"]); // 指定支持的貨幣
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("TWD");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);

  // 日曆
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventName, setEventName] = useState("");
  const [events, setEvents] = useState([]);

  // 新增旅遊主題
  const addTheme = () => {
    if (newTheme && !themes.includes(newTheme)) {
      setThemes([...themes, newTheme]);
      setNewTheme("");
    }
  };

  // 查詢天氣
  const fetchWeather = async () => {
    if (!city) return;
    setWeather({ ...weather, loading: true });
    const apiKey = "a55fb9452417434bd14dd5e14ef733b7"; // 替換為你的 OpenWeatherMap API Key
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      setWeather({ data: response.data, loading: false, error: false });
    } catch (error) {
      setWeather({ ...weather, loading: false, error: true });
    }
  };

  // 貨幣匯率轉換
  const convertCurrency = async () => {
    const apiKey = "48b854def2c80f51c1e35b35"; // 替換為你的 ExchangeRate-API Key
    try {
      const response = await axios.get(
        `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}/${amount}`
      );
      setConvertedAmount(response.data.conversion_result);
    } catch (error) {
      console.error("無法獲取匯率數據", error);
      setConvertedAmount(0);
    }
  };

  // 日曆事件
  const addEvent = () => {
    if (selectedDate && eventName) {
      setEvents([...events, { date: selectedDate, title: eventName }]);
      setEventName("");
    }
  };

  return (
    <div className="App">
      <h1>國際旅遊助手</h1>

      {/* 旅遊主題 */}
      <div>
        <h2>旅遊主題</h2>
        <input
          type="text"
          value={newTheme}
          onChange={(e) => setNewTheme(e.target.value)}
          placeholder="新增主題"
        />
        <button onClick={addTheme}>新增主題</button>
        <ul>
          {themes.map((theme, index) => (
            <li key={index} onClick={() => setCurrentTheme(theme)}>
              {theme}
            </li>
          ))}
        </ul>
        {currentTheme && <h3>目前選擇的主題: {currentTheme}</h3>}
      </div>

      {/* 天氣查詢 */}
      <div>
        <h2>查詢天氣</h2>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="輸入城市名稱"
        />
        <button onClick={fetchWeather}>查詢天氣</button>
        {weather.loading && <p>載入中...</p>}
        {weather.error && <p>查無此城市</p>}
        {weather.data.main && (
          <div>
            <h3>{weather.data.name}</h3>
            <p>溫度: {weather.data.main.temp}°C</p>
            <p>描述: {weather.data.weather[0].description}</p>
          </div>
        )}
      </div>

      {/* 貨幣匯率 */}
      <div>
        <h2>貨幣轉換</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="輸入金額"
        />
        <Dropdown
          options={currencies}
          value={fromCurrency}
          onChange={(option) => setFromCurrency(option.value)}
          placeholder="從"
        />
        <HiSwitchHorizontal onClick={() => setFromCurrency(toCurrency) || setToCurrency(fromCurrency)} />
        <Dropdown
          options={currencies}
          value={toCurrency}
          onChange={(option) => setToCurrency(option.value)}
          placeholder="至"
        />
        <button onClick={convertCurrency}>轉換</button>
        <p>轉換金額: {convertedAmount.toFixed(2)}</p>
      </div>

      {/* 日曆 */}
      <div>
        <h2>日曆</h2>
        <Calendar onClickDay={setSelectedDate} />
        {selectedDate && (
          <div>
            <h3>選擇的日期: {selectedDate.toDateString()}</h3>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="新增事件"
            />
            <button onClick={addEvent}>新增事件</button>
          </div>
        )}
        <ul>
          {events.map((event, index) => (
            <li key={index}>
              {event.date.toDateString()}: {event.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TravelAssistantApp;

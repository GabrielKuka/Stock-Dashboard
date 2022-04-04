import { useEffect, useState, useRef, useContext } from "react";
import { useSelector } from "react-redux";
import { WebSocketContext } from "../components/Test/websocket";
import tradeService from "../services/trade";
import Helper from "../services/Helper";

const useTicker = (ticker) => {
  const ws = useContext(WebSocketContext);
  const stock = useSelector(({ socket }) => socket);

  const [tickerInput, setTickerInput] = useState(ticker);
  const [tickerData, setTickerData] = useState();
  const prevClose = useRef();

  useEffect(() => {
    const fetchInitialPrice = async () => {
      const response = await tradeService.getTickerPrice(tickerInput);
      setTickerData(response);
      prevClose.current = response.previousClose;
    };

    fetchInitialPrice();
    ws.subscribe(tickerInput);

    return () => {
      ws.unsubscribe(tickerInput);
    };
  }, [tickerInput]);

  // Check socket updates
  useEffect(() => {
    if (stock?.ticker === tickerInput) {
      const change = Helper.getChange(stock.price, prevClose.current);
      setTickerData({
        price: stock?.price,
        change: change,
        changePercent: Helper.formatChangePercent(change / prevClose?.current),
      });
    }
  }, [stock.price]);

  return [tickerData, setTickerInput];
};

export default useTicker;

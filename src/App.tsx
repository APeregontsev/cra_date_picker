import { useState } from "react";
import style from "./App.module.scss";
import DateInput from "./DateInput/DateInput";

function App() {
  const [value, setValue] = useState<Date | undefined>();
  const [value2, setValue2] = useState<Date | undefined>();

  return (
    <div className={style.container}>
      <DateInput value={value} setValue={setValue} />

      <DateInput value={value2} setValue={setValue2} />
    </div>
  );
}

export default App;

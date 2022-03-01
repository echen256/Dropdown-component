
import "./App.css";
import Dropdown from "./components/dropdown"

//main app, hosts the 2 test cases
//will console log selected entries when you make a selection, but devs can write their own 
//custom onChange method to receive updates from the component

function App() {
  let testCase = [];

  for (var i = 0; i < 100; i++) {
    testCase.push({ label: i  , value: i  });
  }

  const onChange = (selectedItems) => {
    console.log(selectedItems)
  }

  return (
    <div className="App">
    
      <p className = "introduction">
      To select multiple items, hold down the control key while clicking through the list. 
      </p>  
      <p className = "introduction">
      To select all items / deselect all items, hold down alt or press the + / - icon that appears
      </p>

      <hr/>
      <br/>

      <label>Multiple Select with 100 items</label>
      <hr/>
      <Dropdown
        placeholder="Select an item..."
        selectMultiple={true}
        options={testCase}
        onChange = {onChange }
      />
      <br />

      <label>Single Select With 100 items </label>
      <hr/>
      <Dropdown
        onChange = {onChange }
        placeholder="Select an item..."
        selectMultiple={false}
        options={testCase}
      />
    </div>
  );
}

export default App;

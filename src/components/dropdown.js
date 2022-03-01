import React, { useState, useEffect, useRef, useCallback } from "react";
import "./dropdown.css";
import arrowDown from "./svg/arrow-down.svg";
import plus from "./svg/plus.svg";
import minus from "./svg/minus.svg";
//Main component for dropdown, contains the click handlers and options data
//dropdowns will exit if you press escape or click outside the component
//dropdowns accept an array of options that are json objects. dropdown looks for
//a key called label and a key called value
//dropdown can have multiple select enabled by passing a selectMultiple attribute
//you can set a default placeholder for when no items are selected via the placeHolder attribute
//you can select multiple items by holding down the ctrl key while clicking
//select all / deslect all by holding down the alt key

export default function Dropdown(props) {
  const ref = useRef(null);

  const options = props.options;
  const [selectedItems, setSelectedItems] = useState({});
  const [dropDownOpen, toggleDropdownOpen] = useState(false);

  //listens for escape key press
  const escapeListener = useCallback((event) => {
    if (event.key === "Escape") {
      toggleDropdownOpen(false);
    }
  }, []);

  //listesn for external click
  const clickListener = useCallback(
    (event) => {
      if (!ref.current.contains(event.target)) {
        toggleDropdownOpen(false);
      }
    },
    [ref.current]
  );

  useEffect(() => {
    setSelectedItems({});
  }, [options]);

  useEffect(() => {
    if (props.onChange) {
      props.onChange(selectedItems);
    }
  }, [selectedItems]);

  //allows the component to know if user clicked outside it
  useEffect(() => {
    document.addEventListener("click", clickListener);
    document.addEventListener("keyup", escapeListener);
    return () => {
      document.removeEventListener("click", clickListener);
      document.removeEventListener("keyup", escapeListener);
    };
  }, []);

  return (
    <div ref={ref} className="dropdown-root">
      <DropdownBar
        selectMultiple={props.selectMultiple}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        options={options}
        dropDownOpen={dropDownOpen}
        toggleDropdownOpen={toggleDropdownOpen}
        placeholder={props.placeholder}
      />
      <DropdownOptionsContainer
        options={options}
        selectMultiple={props.selectMultiple}
        toggleDropdownOpen={toggleDropdownOpen}
        dropDownOpen={dropDownOpen}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
      />
    </div>
  );
}

//bar that contains the selected items labels.
//if select multiple is enabled, then + / - icon will show that allows the user to select / deselect all options

const DropdownBar = (props) => {
  const { options } = props;
  let selectedItems = props.selectedItems;
  let selectedItemsKeys = Object.keys(selectedItems);
  let labelString = "";
  selectedItemsKeys.forEach((selectedItemKey) => {
    labelString += options[selectedItemKey].label + ", ";
  });
  if (labelString.length > 0) {
    labelString = labelString.substring(0, labelString.length - 2);
  } else {
    labelString = props.placeholder;
  }

  let canSelectAll =
    options.length > Object.keys(selectedItems).length && props.selectMultiple;

  const selectAll = () => {
    selectedItems = {};
    if (canSelectAll) {
      for (var i = 0; i < props.options.length; i++) {
        selectedItems[i] = props.options[i];
      }
    }
    props.setSelectedItems(selectedItems);
  };

  return (
    <div className="dropdown-bar">
      <div
        style={{ flexGrow: 1, textAlign: "left" }}
        onClick={() => {
          props.toggleDropdownOpen(!props.dropDownOpen);
        }}
      >
        {" "}
        {labelString}
      </div>

      {props.dropDownOpen &&
        props.selectMultiple &&
        (canSelectAll ? (
          <img
            src={plus}
            className={"dropdown-add-all-icon"}
            onClick={selectAll}
          />
        ) : (
          <img
            src={minus}
            className={"dropdown-add-all-icon"}
            onClick={selectAll}
          />
        ))}

      <img
        onClick={() => {
          props.toggleDropdownOpen(!props.dropDownOpen);
        }}
        src={arrowDown}
        className={
          props.dropDownOpen ? "dropdown-icon-open" : "dropdown-icon-close"
        }
      />
    </div>
  );
};

//container for all the dropdown items

const DropdownOptionsContainer = (props) => {
  return (
    <div>
      {props.dropDownOpen && (
        <div className="dropdown-container">
          {props.options.map((option, index) => {
            return (
              <DropdownOption
                options={props.options}
                index={index}
                option={option}
                selectMultiple={props.selectMultiple}
                setSelectedItems={props.setSelectedItems}
                selectedItems={props.selectedItems}
              />
            );
          })}
        </div>
      )}{" "}
    </div>
  );
};

//individual option

const DropdownOption = (props) => {
  let selectedItems = props.selectedItems;
  let item = props.selectedItems[props.index];

  const onClick = (event) => {
    if (props.selectMultiple) {
      if (event.altKey) {
        if (Object.keys(selectedItems).length < props.options.length) {
          for (var i = 0; i < props.options.length; i++) {
            selectedItems[i] = props.options[i];
          }
        } else {
          selectedItems = {};
        }
      } else if (event.ctrlKey) {
        if (item) {
          delete selectedItems[props.index];
        } else {
          selectedItems[props.index] = props.option;
        }
      } else {
        selectedItems = {};
        selectedItems[props.index] = props.option;
      }
    } else {
      selectedItems = {};
      selectedItems[props.index] = props.option;
    }
    props.setSelectedItems({ ...selectedItems });
  };

  let selectedClassName = item ? "dropdown-selected" : "";
  return (
    <div className={`dropdown-option ${selectedClassName}`} onClick={onClick}>
      {props.option.label}
    </div>
  );
};

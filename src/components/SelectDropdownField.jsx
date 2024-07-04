import PropTypes from "prop-types";

import "./SelectDropdownField.css";
import { useCallback, useEffect, useRef, useState } from "react";

import arrowDown from "../assets/icon/arrow-down.svg";

export default function SelectDropdownField({
  kopraUITagsTemp = [],
  kopraUIPlaceholder = "",
  options = [],
  isDisabled = false,
  withSearch = true,
  multiple = true,
  outline = true,
  id = "",
}) {
  const [isTagDisabled, setIsTagDisabled] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchedListDataDropDown, setSearchedListDataDropDown] = useState([]);
  const [isTagInputInvalid, setIsTagInputInvalid] = useState(false);
  const [kopraUITags, setkopraUITags] = useState([]);
  const [searchKeyWord, setSearchKeyWord] = useState("");

  const ref = useRef(null);

  const toggleDropdown = () => {
    if (!isTagDisabled) {
      setDropdownVisible(true);
      setSearchedListDataDropDown(options);
    }
  };

  const handleCloseTagText = (data) => {
    onRemoveTag(data);
  };

  const onFocus = () => {
    setSearchedListDataDropDown(options);
  };

  const onBlur = () => {};

  const handleChange = (value) => {
    setSearchKeyWord(value.target.value);

    if (value !== "") {
      const keyword = options.filter((data) =>
        data.toLowerCase().includes(value.target.value.toLowerCase())
      );

      setSearchedListDataDropDown(keyword);
    } else {
      setSearchedListDataDropDown(options);
    }
  };

  const open = useCallback(
    () => searchedListDataDropDown.length > 0 && dropdownVisible,
    [dropdownVisible, searchedListDataDropDown.length]
  );

  const onEnterEventHandler = (event, data) => {
    if (multiple) {
      if (event.target.checked) {
        const arr = [];
        arr.push(data);
        setkopraUITags([...kopraUITags, ...arr]);

        setIsTagInputInvalid(false);
      } else {
        onRemoveTag(data);
      }
    } else {
      if (data === kopraUITags[0]) {
        onRemoveTag(data);
      } else {
        setkopraUITags([data]);

        setIsTagInputInvalid(false);
      }
    }
  };

  const onRemoveTag = (data) => {
    const filteredKopraUITags = kopraUITags.filter((filter) => filter !== data);

    setkopraUITags(filteredKopraUITags);
  };

  useEffect(() => {
    setIsTagDisabled(isDisabled);
    setkopraUITags(kopraUITagsTemp);

    open();

    /**
     * Alert if clicked on outside of element
     */
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDisabled, kopraUITagsTemp, open]);

  return (
    <div id={id} ref={ref} onClick={() => toggleDropdown()} className="relative cursor-pointer">
      <div
        className={`kopra-ui-textarea-tags-container ${outline ? "bg-white" : "bg-gray-200"} ${isTagDisabled ? "tag-disabled" : ""}`}
      >
        {kopraUITags.map((tag, index) => (
          <Chip
            kopraUICloseTags={true}
            kopraUITags={[tag]}
            key={tag}
            index={index}
            kopraUICloseClick={(data) => handleCloseTagText(data)}
          />
        ))}

        {withSearch && (
          <input
            className={`${isTagDisabled ? "tag-disabled" : ""} ${kopraUITags.length === 0 ? "tag-empty" : ""} ${outline ? "bg-white" : "bg-gray-200"}`}
            type="text"
            disabled={isTagDisabled}
            onFocus={() => onFocus()}
            onBlur={() => onBlur()}
            placeholder={kopraUIPlaceholder}
            onChange={(e) => handleChange(e)}
            form
          />
        )}
      </div>

      <div className="absolute inset-y-0 right-3-5 flex items-center">
        |
        <img
          className={open() ? "rotate-180" : ""}
          style={{
            marginLeft: 8,
          }}
          src={arrowDown}
          alt="arrowDown"
        />
      </div>

      {isTagInputInvalid && <p className="text-red-500 text-xs">Required Field</p>}

      {open() && (
        <div className="mt-2 container-list bg-white">
          <ul>
            {searchedListDataDropDown.map((item, i) => (
              <li key={item} className={`${i !== 0 ? "border-t" : ""} p-4 list-item`}>
                {multiple ? (
                  <CheckBox
                    checked={kopraUITags?.includes(item)}
                    onChange={(e) => onEnterEventHandler(e, item)}
                    label={item}
                    disabled={false}
                    item={item}
                    keyword={searchKeyWord}
                  />
                ) : (
                  <SingleSelect
                    onChange={(e) => onEnterEventHandler(e, item)}
                    label={item}
                    disabled={false}
                    item={item}
                    keyword={searchKeyWord}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export const CheckBox = ({
  label = "",
  checked = false,
  onChange,
  disabled = false,
  CheckboxStyle = "check",
  desc = "",
  keyword = "",
}) => {
  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span
        className="checkbox-kopra-ui-label"
        style={{
          textAlign: "start",
          paddingLeft: 8,
        }}
      >
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight?.toLowerCase()
                ? { fontWeight: "bold", color: "white", backgroundColor: "#27C6DA" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return (
    <label>
      <div disabled={disabled} className="checkbox-kopra-ui">
        <div className="checkbox-kopra-ui-container">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e)}
            disabled={disabled}
          />
          <span className="checkbox-kopra-ui-checkmark">
            {checked && (
              <span
                className={`${CheckboxStyle === "check" ? "checkbox-kopra-ui-check-icon" : "checkbox-kopra-ui-stripe-icon"} `}
              ></span>
            )}
            {checked && disabled && (
              <span
                className={`${CheckboxStyle === "check" ? "checkbox-kopra-ui-check-icon-disabled" : "checkbox-kopra-ui-stripe-icon-disabled"} `}
              ></span>
            )}
          </span>
        </div>
        {getHighlightedText(label, keyword)}
      </div>
      {desc && (
        <div className="checkbox-kopra-ui">
          <p className="checkbox-kopra-ui-description">{desc}</p>
        </div>
      )}
    </label>
  );
};

export const SingleSelect = ({
  label = "",
  onChange,
  disabled = false,
  desc = "",
  keyword = "",
}) => {
  const getHighlightedText = (text, highlight) => {
    // Split on highlight term and include term into parts, ignore case
    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <span
        className="checkbox-kopra-ui-label"
        style={{
          textAlign: "start",
          paddingLeft: 8,
        }}
      >
        {parts.map((part, i) => (
          <span
            key={i}
            style={
              part.toLowerCase() === highlight?.toLowerCase()
                ? { fontWeight: "bold", color: "white", backgroundColor: "#27C6DA" }
                : {}
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  return (
    <label onClick={(e) => onChange(e, label)}>
      <div disabled={disabled} className="checkbox-kopra-ui">
        {getHighlightedText(label, keyword)}
      </div>
      {desc && (
        <div className="checkbox-kopra-ui">
          <p className="checkbox-kopra-ui-description">{desc}</p>
        </div>
      )}
    </label>
  );
};

export const Chip = ({ kopraUICloseClick, kopraUICloseTags = false, kopraUITags = [] }) => {
  const removeTag = (kopraUITag, event) => {
    event.stopPropagation();
    const index = kopraUITags.indexOf(kopraUITag);
    if (index > -1) {
      kopraUITags.splice(index, 1);
    }

    kopraUICloseClick(kopraUITag);
  };

  return (
    <div className="kopra-ui-tags flex kopra-ui-chip-input-text-area">
      {kopraUITags.map((kopraUITagText) => (
        <div
          key={kopraUITagText}
          className="kopra-ui-tag"
          style={{
            backgroundColor: "#f7f6f6",
            borderColor: "#ededed",
          }}
        >
          <span
            className="kopra-ui-tag-label"
            style={{
              color: "#494949",
            }}
          >
            {kopraUITagText}
          </span>

          {kopraUICloseTags && (
            <button
              className="kopra-ui-tag-close"
              onClick={(event) => removeTag(kopraUITagText, event)}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6648 10.6665L7.9987 8.00016M7.9987 8.00016L5.33203 5.33321M7.9987 8.00016L5.3326 10.6665M7.9987 8.00016L10.6654 5.33321M14.6654 8.00004C14.6654 4.31814 11.6806 1.33337 7.9987 1.33337C4.3168 1.33337 1.33203 4.31814 1.33203 8.00004C1.33203 11.6819 4.3168 14.6667 7.9987 14.6667C11.6806 14.6667 14.6654 11.6819 14.6654 8.00004Z"
                  stroke="#686868"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

CheckBox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  CheckboxStyle: PropTypes.string,
  desc: PropTypes.string,
  i: PropTypes.number,
  keyword: PropTypes.string,
};

SingleSelect.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  CheckboxStyle: PropTypes.string,
  desc: PropTypes.string,
  i: PropTypes.number,
  keyword: PropTypes.string,
};

Chip.propTypes = {
  index: PropTypes.number,
  kopraUICloseClick: PropTypes.func,
  kopraUICloseTags: PropTypes.bool,
  kopraUITags: PropTypes.array,
};

SelectDropdownField.propTypes = {
  options: PropTypes.array,
  kopraUITagsTemp: PropTypes.array,
  kopraUIPlaceholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  withSearch: PropTypes.bool,
  multiple: PropTypes.bool,
  outline: PropTypes.bool,
  id: PropTypes.string,
};

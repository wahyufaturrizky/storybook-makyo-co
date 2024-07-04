import SelectDropdownField from "./SelectDropdownField";

export default {
  component: SelectDropdownField,
  title: "SelectDropdownField",
  tags: ["autodocs"],
  excludeStories: /.*Data$/,
  args: {},
};

export const Default = {
  args: {
    kopraUITagsTemp: [],
    kopraUIPlaceholder: "",
    options: [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
      "Option 6",
      "Option 7",
      "Option 8",
      "Option 9",
      "Option 10",
    ],
    isDisabled: false,
    multiple: true,
    outline: true,
    withSearch: true,
    id: "sdd-1",
  },
};

import React from "react";
import { Button, Dropdown, FormControl, InputGroup } from "react-bootstrap";
import "./SearchInput.scss";

interface SearchInputOption {
  label: string;
  value: any;
  id: string;
}

interface SearchInputProps {
  options: SearchInputOption[];
  onSelect?: (option: SearchInputOption) => void;
  multi?: boolean;
}

function SearchInput({ options, onSelect, multi }: SearchInputProps) {
  const [search, setSearch] = React.useState("");
  const [selection, setSelection] = React.useState<SearchInputOption | null>(
    null
  );

  return (
    <React.Fragment>
      <InputGroup className="d-flex align-content-stretch">
        <InputGroup.Prepend>
          <Dropdown
            className="rockstar-yellow"
            onSelect={(eventKey: any) => {
              const selection = options.filter(
                (option) => option.id === eventKey
              )[0];
              setSelection(selection);
              if (!multi) {
                onSelect && onSelect(selection);
                setSearch("");
              }
            }}
          >
            <Dropdown.Toggle
              id="dropdown-custom-components"
              className="w-100 text-left"
            >
              {(selection && selection.label) || "Select an item..."}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <FormControl
                autoFocus
                className="mx-3 my-2 w-auto"
                placeholder="Type to filter..."
                value={search}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setSearch(event.target.value)
                }
              />
              {(search
                ? options.filter((option) =>
                    option.label.toLowerCase().includes(search.toLowerCase())
                  )
                : options
              ).map((option, index) => (
                <Dropdown.Item key={index} eventKey={option.id}>
                  {option.label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </InputGroup.Prepend>
        {multi && (
          <InputGroup.Append>
            <Button
              className="rockstar-yellow"
              onClick={() => {
                if (selection) {
                  onSelect && onSelect(selection);
                  setSearch("");
                }
              }}
            >
              +
            </Button>
          </InputGroup.Append>
        )}
      </InputGroup>
    </React.Fragment>
  );
}

export default SearchInput;

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import path from "path";
import { remote } from "electron";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMemory,
  faFolder,
  faUndo,
  faLevelDownAlt
} from "@fortawesome/free-solid-svg-icons";
import { Slider, Button, Input, Switch } from "antd";
import {
  updateJavaArguments,
  updateJavaMemory,
  updateJavaPath
} from "../../../reducers/settings/actions";
import { DEFAULT_JAVA_ARGS } from "../../../../app/desktop/utils/constants";
import { _getJavaPath } from "../../../utils/selectors";

const JavaSettings = styled.div`
  width: 100%;
  height: 500px;
`;

const AutodetectPath = styled.div`
  margin-top: 38px;
  width: 100%;
  height: 100px;
`;

const SelectMemory = styled.div`
  width: 100%;
  height: 100px;
`;

const JavaCustomArguments = styled.div`
  width: 100%;
  height: 120px;
`;

const Title = styled.h3`
  position: absolute;
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.palette.text.main};
`;

const Paragraph = styled.p`
  text-align: left;
  color: ${props => props.theme.palette.text.third};
  width: 300px;
`;

const Hr = styled.hr`
  opacity: 0.29;
  background: ${props => props.theme.palette.secondary.light};
`;

const StyledButtons = styled(Button)``;

function resetJavaArguments(dispatch) {
  dispatch(updateJavaArguments(DEFAULT_JAVA_ARGS));
}

const openFolderDialog = (
  javaPath,
  updateJavaArguments,
  updateJavaPath,
  dispatch
) => {
  remote.dialog.showOpenDialog(
    {
      properties: ["openFile"],
      defaultPath: path.dirname(javaPath)
    },
    paths => dispatch(updateJavaPath(paths[0]))
  );
};

const marks = [
  {
    value: 2048,
    label: "2048 mb"
  },
  {
    value: 4096,
    label: "4096 mb"
  },
  {
    value: 8192,
    label: "8192 mb"
  },
  {
    value: 16384,
    label: "16384 mb"
  }
];

export default function MyAccountPreferences() {
  const javaArgs = useSelector(state => state.settings.java.args);
  const javaMemory = useSelector(state => state.settings.java.memory);
  const javaPath = useSelector(_getJavaPath);
  const [autodetectJavaPath, setAutodetectJavaPath] = useState(true);
  const [memory, setMemory] = useState(javaMemory);
  const dispatch = useDispatch();

  return (
    <JavaSettings>
      <h1
        css={`
          float: left;
          margin: 0;
        `}
      >
        Java
      </h1>
      <AutodetectPath>
        <Title
          css={`
            position: absolute;
            top: 80px;
          `}
        >
          Autodetect Java Path&nbsp; <FontAwesomeIcon icon={faFolder} />
        </Title>
        <Paragraph
          css={`
            position: absolute;
            top: 100px;
          `}
        >
          If enable, Java path will be autodetected
        </Paragraph>
        <Switch
          style={{
            float: "right",
            marginTop: "65px"
          }}
          color="primary"
          onChange={c => setAutodetectJavaPath(c.target.checked)}
          checked={autodetectJavaPath}
        />
      </AutodetectPath>
      {!autodetectJavaPath && (
        <>
          <div
            css={`
              height: 40px;
              margin-top: 30px;
            `}
          >
            <div
              css={`
                margin-top: 20px;
                width: 100%;
              `}
            >
              <FontAwesomeIcon
                icon={faLevelDownAlt}
                flip="horizontal"
                transform={{ rotate: 90 }}
              />
              <Input
                css={`
                  width: 75%;
                  margin-right: 10px;
                  margin-left: 10px;
                `}
                onChange={e => dispatch(updateJavaPath(e.target.value))}
                value={javaPath}
              />
              <StyledButtons
                color="primary"
                onClick={() =>
                  openFolderDialog(
                    javaPath,
                    updateJavaArguments,
                    updateJavaPath,
                    dispatch
                  )
                }
              >
                <FontAwesomeIcon icon={faFolder} />
              </StyledButtons>
            </div>
          </div>
        </>
      )}
      <Hr />
      <SelectMemory>
        <Title
          css={`
            position: relative;
            top: 0;
            width: 100%;
            margin-top: 0px;
            height: 8px;
            text-align: left;
          `}
        >
          Java Memory&nbsp; <FontAwesomeIcon icon={faMemory} />
        </Title>
        <p
          css={`
            width: 100%;
            text-align: left;
            margin: 0;
          `}
        >
          Select the preferred amount of memory to use when lauching the game
        </p>
        <Slider
          css={`
            margin-top: 20px;
          `}
          onChangeCommitted={(e, val) => dispatch(updateJavaMemory(val))}
          onChange={(e, val) => setMemory(val)}
          defaultValue={memory}
          min={1024}
          max={16384}
          step={512}
          marks={marks}
          valueLabelDisplay="auto"
        />
      </SelectMemory>
      <Hr />
      <JavaCustomArguments>
        <Title
          css={`
            position: relative;
            top: 0;
            width: 100%;
            margin-top: 0px;
            height: 8px;
            text-align: left;
          `}
        >
          Java Custom Arguments
        </Title>
        <p
          css={`
            marin-top: 20px;
            width: 100%;
            margin: 0;
            text-align: left;
          `}
        >
          Select the preferred amount of memory to use when lauching the game
        </p>
        <div
          css={`
            margin-top: 20px;
            width: 100%;
          `}
        >
          <Input
            onChange={e => dispatch(updateJavaArguments(e.target.value))}
            value={javaArgs}
            css={`
              width: 83%;
              height: 26px;
              margin-right: 10px;
            `}
          />
          <StyledButtons
            onClick={() => resetJavaArguments(dispatch)}
            color="primary"
          >
            <FontAwesomeIcon icon={faUndo} />
          </StyledButtons>
        </div>
      </JavaCustomArguments>
    </JavaSettings>
  );
}

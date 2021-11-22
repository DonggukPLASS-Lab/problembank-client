import React, { useEffect, useState} from "react";
import "./style.scss";
import TestLayout from "../../../../layouts/TestLayout";
import InlineList from "../../../../components/DesignComponent/InlineList";
import Input from "../../../../components/DesignComponent/Input";
import Text from "../../../../components/DesignComponent/Text";
import Spacing from "../../../../components/DesignComponent/Spacing";
import Select, { Option } from "../../../../components/DesignComponent/Select";
import WrapperLoading from "../../../../components/WrapperLoading";
import TestDisplay from "../../components/TestDisplay";
import Loading from "../../../../components/Loading/Loading";
import { Consumer as ModalConsumer } from "../../../../components/Modal/createModalProvider";
import { NOTICE_MODAL } from "../../../../components/Modal/ModalProviderWithKey";
import testsAPI from "../../../../apis/tests";
import ProblemDisplayTable from "../../../MultipleChoice/components/ProblemDisplayTable";
import {useSelector} from 'react-redux';

function TestPage(props) {
  const [loading, setLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [constList, setConstList] = useState([]); // 한번 가져오면 변하지 않는 리스트
  const [totalList, setTotalList] = useState([]);
  const [first, setFirst] = useState(false);
  const [vaildButton, setVaildButton] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [typeValue, setTypeValue] = useState("all");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (!first) {
      setTestList();
    }
  }, [totalList, first]);


  const setTestList = async () => {
    try {
      setVaildButton(false);
      setSearchValue("");
      setTypeValue("all");
      if (Object.keys(user).length > 0 && user.userData.roleId == 5) {
        // 신청하지 않은 contest 목록 가져오기
        const response = await testsAPI.getAllTestDataNormalUser();
        const result = response.data;
        setFirst(true);
        setTotalList(result);
        setConstList(result);
        setAllLoading(false);
      } else if (
        (Object.keys(user).length > 0 && user.userData.roleId == 1) || // manager(admin)
        user.userData.roleId == 2 || // coursecreator
        user.userData.roleId == 3 || // professor
        user.userData.roleId == 10 // ta
      ) {
        const response = await testsAPI.getAllTestDataNormalUser();
        const result = response.data;
        setFirst(true);
        setTotalList(result);
        setConstList(result);
      }
      setAllLoading(false);
    } catch (error) {
      console.log(error)
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요. 1");
      // console.log(error);
    }
  };

  const regTest = async (value) => {
    try {
      setAllLoading(true);
      const params = {
        user_id: user.userData.data.id,
        test_id: value,
      };
      const response = await testsAPI.regTest(params);
      // console.log(response);
      setFirst(false);
    } catch (error) {
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요. 2");
      // console.log(error)
    }
  };

  const cancelReg = async (value) => {
    // delete test
    try {
      setAllLoading(true);
      const params = {
        user_id: user.userData.data.id,
        test_id: value,
      };
      const response = await testsAPI.cancelReg(params);
      if (response.result === true) {
        alert("시험이 삭제되었습니다.");
      }
      // console.log(response);
      setFirst(false);
    } catch (error) {
      alert("서버 오류입니다. 잠시 후 다시 시도해주세요. 3");
      // console.log(error)
    }
  };

  const OnVaildButton = (name, value) => {
    if (value) {
      setVaildButton(true);
      TotalUpdate(true, searchValue, typeValue);
    } else {
      setVaildButton(false);
      TotalUpdate(false, searchValue, typeValue);
    }
  };

  const OnSearchInput = (name, value) => {
    setSearchValue(value);
    TotalUpdate(vaildButton, value, typeValue);
  };

  const OnTypeToggle = (name, value) => {
    setTypeValue(value); // typeValue
    // console.log(value);
    if (value == "test") {
      TotalUpdate(vaildButton, searchValue, "test");
    } else if (value == "contest") {
      TotalUpdate(vaildButton, searchValue, "contest");
    } else {
      TotalUpdate(vaildButton, searchValue, "all");
    }
  };
  const TotalUpdate = (valid, serchVal, type) => {
    setLoading(true);
    if (valid) {
      const entry = constList.filter((value) => {
        let start = new Date(value.start);
        let end = new Date(value.end);
        let now = new Date();
        let validEntry = false;
        let validApply = false;
        if (now < end && now > start && Number(value.in_entry) === 1)
          validEntry = true;
        if (now < start && Number(value.in_entry) === 0) validApply = true;

        return validEntry || validApply;
      });
      const entry2 = entry.filter((value) => {
        return value.name.match(new RegExp(serchVal, "i"));
      });

      if (type == "test") {
        const result = entry2.filter((value) => {
          return Number(value.is_exam) == 1;
        });
        setTotalList(result);
      } else if (type == "contest") {
        const result = entry2.filter((value) => {
          return Number(value.is_exam) == 0;
        });
        setTotalList(result);
      } else {
        setTotalList(entry2);
      }
    } else {
      const entry = constList.filter((value) => {
        // console.log(value.is_exam);
        return value.name.match(new RegExp(serchVal, "i"));
      });

      if (type == "test") {
        const result = entry.filter((value) => {
          return Number(value.is_exam) == 1;
        });
        setTotalList(result);
      } else if (type == "contest") {
        const result = entry.filter((value) => {
          return Number(value.is_exam) == 0;
        });
        setTotalList(result);
      } else {
        setTotalList(entry);
      }
    }
    setInterval(function () {
      setLoading(false);
    }, 500);
  };

  if (allLoading) {
    return <Loading type={"bars"} color={"black"} />;
  }

  return (
    <TestLayout>
      <Spacing vertical={3} />
      <InlineList align="center">
        <Input
          name="content"
          type="text"
          placeholder="내용을 입력해주세요"
          width={100}
          onChange={OnSearchInput}
          value={searchValue}
        />
        {user.userData.roleId == 5 && (
          <Input
            type="checkbox"
            name="vaildTest"
            onChange={OnVaildButton}
            checked={vaildButton}
          />
        )}
        {user.userData.roleId == 5 && <Text>입장 가능만 보기</Text>}
      </InlineList>
      <Spacing vertical={10} />
      <div className="test-body">
        <Spacing horizontal={50}>
          <ModalConsumer>
            {
            ({ openModal }) => (
              <div>
                {loading ? <WrapperLoading type={"bars"} color={"black"} />
                  : <TestDisplay totalList = {totalList} />
                }
              </div>
            )}
          </ModalConsumer>
          {/* <button id="goMainPage" onClick={() => props.history.push(`/`)}>
            메인 화면으로
          </button> */}
        </Spacing>
      </div>
      {/* <Button test onPress={()=>TestButton()}>실험용</Button> */}
    </TestLayout>
  );
}

export default TestPage;

const tableHead = (prop) => {
  return <th width={prop.width}>{prop.title}</th>
}


// [
//   <th width="1%">번호</th>
//   <th width="10%">제목</th>
//   <th width="25%">설명</th>
//   <th width="10%">시험 시작</th>
//   <th width="10%"> 시험 종료</th>
//   <th width="10%">시험상태</th>
//   <th width="10%">시험 결과 상태</th>
//   <th width="10%">시험 삭제 </th>
//   <th width="10%">피드백 </th>
// ]
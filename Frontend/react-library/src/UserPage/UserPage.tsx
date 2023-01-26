import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "../Stylesheet/UserPage.module.css";
import { useState } from "react";
import UserModel from "../Models/UserModel";
import { SpinnerLoading } from "../Util/SpinnerLoading";
import { Link } from "react-router-dom";
import { yellow } from "@mui/material/colors";

export default function UserPage() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const baseUrl: string = "http://localhost:8080/api/users";

      const response = await fetch(baseUrl);

      if (!response.ok) {
        throw new Error("클났다. 문제가있다.");
      }

      const responseJson = await response.json();

      const responseData = responseJson._embedded.users;

      const loadedUsers: UserModel[] = [];

      for (const key in responseData) {
        loadedUsers.push({
          userId: responseData[key].userId,
          userName: responseData[key].userName,
          userAddr: responseData[key].userAddr,
          userPhone: responseData[key].userPhone,
          userEmail: responseData[key].userEmail,
          userRegDate: responseData[key].userRegDate,
          userBirth: responseData[key].userBirth,
          userStatus: responseData[key].userStatus,
          viewSelf: responseData[key]._links.self.href,
        });
      }
      setUsers(loadedUsers);
      setIsLoading(false);
    };
    fetchUsers().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <>
        <SpinnerLoading />
      </>
    );
  }
  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  return (
    <>
      <h1 className={styles.header}>구성원 관리</h1>
      <div className={styles.main}>
        <hr />
        <TableContainer component={Paper} className={styles.tablecontainer}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className={styles.tablehead}>
              <TableRow>
                <TableCell>이름</TableCell>
                <TableCell align="center">아이디</TableCell>
                <TableCell align="center">연락처</TableCell>
                <TableCell align="center">이메일</TableCell>
                <TableCell align="center">주소</TableCell>
                <TableCell align="center">생년월일</TableCell>
                <TableCell align="center">상태</TableCell>
                <TableCell align="center">비고</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow className={styles.tableRow}
                  key={user.userName}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Link className={styles.link}
                      to={`/users/${Number(
                        user.viewSelf.charAt(user.viewSelf.length - 1)
                      )}`}
                    >
                      {user.userName}
                    </Link>
                  </TableCell>
                  <TableCell align="center">{user.userId}</TableCell>
                  <TableCell align="center">{user.userPhone}</TableCell>
                  <TableCell align="center">{user.userEmail}</TableCell>
                  <TableCell align="center">{user.userAddr}</TableCell>
                  <TableCell align="center">
                    {user.userBirth.split("T")[0]}
                  </TableCell>
                  <TableCell align="center">
                    <form>
                    <select>
                      <option>수료</option>
                      <option>미수료</option>
                      <option>인턴예정</option>
                      <option selected>교육중</option>
                      <option>퇴소</option>
                    </select>
                    <button type="button">수정</button>
                    </form>
                  </TableCell>
                  {user.userStatus === undefined ? (
                    <TableCell align="center">{user.userStatus}</TableCell>
                  ) : (
                    <TableCell align="center">교육 중</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

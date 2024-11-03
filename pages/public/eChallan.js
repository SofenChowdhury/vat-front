import React, { useEffect, useState } from "react";

//axios
import axios from "axios";

//html
import DOMPurify from "dompurify";

//date
import moment from "moment";

const EChallan = ({ query }) => {
  //Helper Variables
  const [pageContent, setPageContent] = useState(null);

  //Query subform data
  const chalan_no = query?.chalan_no;
  const chalan_date = query?.chalan_date;
  const bank_id = query?.bank_id;
  const bank_branch_id = query?.bank_branch_id;
  const trans_type = query?.trans_type;

  useEffect(() => {
    // const data = {
    //   chalan_no,
    //   chalan_date: moment(chalan_date).format("DD-MM-YYYY"),
    //   bank_id,
    //   bank_branch_id,
    //   trans_type,
    // };

    const formData = new FormData();
    formData.append("chalan_no", chalan_no);
    formData.append("chalan_date", moment(chalan_date).format("DD-MM-YYYY"));
    formData.append("bank_id", bank_id);
    formData.append("bank_branch_id", bank_branch_id);
    formData.append("trans_type", trans_type);
    const api = "http://103.48.16.132/echalan/VerifyChalan_new.php";

    axios
      .post(api, formData)
      .then((response) => {
        console.log(response);
        const sanitizedHTML = DOMPurify.sanitize(response.data);
        setPageContent(sanitizedHTML);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: pageContent,
      }}
    ></div>
  );
};

EChallan.getInitialProps = async ({ query }) => {
  return {
    query,
  };
};

export default EChallan;

import React from "react";

import exportFromJSON from "export-from-json";

const ExportExcel = (data, fileName, exportType) => {
  exportFromJSON({ data, fileName, exportType });
};

export default ExportExcel;

exports.apiResponse = (status, message, data) => {
  return { status, message, data };
};

exports.errorResponse = (message) => {
  return { status: "Erro", message };
};

exports.successResponse = (data) => {
  return { status: "Sucesso", data };
};

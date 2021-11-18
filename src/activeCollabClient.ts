import Client from './activeCollab';


export default new Client(
    process.env.AC_USER || "",
    process.env.AC_PASSWORD || "",
    process.env.AC_PROJECT || "",
    process.env.AC_PROJECT_OWNER || "",
    undefined,
    process.env.AC_DOMAIN || "",
);
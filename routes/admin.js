var express = require("express");
var router = express.Router();
var pool = require("./pool");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./security");

/////////////////// ----------------> Admin Interface <----------\\\\\\\\\\\\\\\\\\\

router.get("/adminlogin", function (req, res) {
  res.render("adminlogin", { message: "" });
});

///////////// Admin LogOut ------------------>>>>>>>>>>

router.get("/adminlogout", function (req, res) {
  localStorage.clear();
  res.render("adminlogin", { message: "" });
});

//////--------------> Check Admin Email and Password --------------------->

router.post("/chkadmin", function (req, res) {
  pool.query(
    "select * from employee_db.admin where (emailid=? or mobno=?) and password=?",
    [req.body.emailid, req.body.emailid, req.body.password],
    function (error, result) {
      if (error) {
        // console.log(error);
        res.render("adminlogin", { message: "Server Error" });
      } else {
        if (result.length == 1) {
          // console.log(result);
          localStorage.setItem("ADMIN", JSON.stringify(result[0]));
          res.render("dashboard", { data: result });
        } else {
          res.render("adminlogin", {
            message: "Invalid Email Address And Password",
          });
        }
      }
    }
  );
});

module.exports = router;

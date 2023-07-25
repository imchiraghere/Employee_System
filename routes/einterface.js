var express = require("express");
const { createPool } = require("mysql");
var router = express.Router();
var pool = require("./pool");
var upload = require("./multer");
var LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./security");

///////////////////-----------> Employee Interface <--------------\\\\\\\\\\\\\\\

router.get("/empinterface", function (req, res) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (admin) {
    res.render("empinterface", { message: "" });
  } else {
    res.render("adminlogin", { message: "" });
  }
});

///////////////// ----------> Fetch State's by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchstates", function (req, res) {
  pool.query("select * from states", function (error, result) {
    if (error) {
      res.status(500).json({ result: [], message: "Server Error" });
    } else {
      res.status(200).json({ result: result, message: "Success" });
    }
  });
});

///////////////// ----------> Fetch City's by DB <-----------------\\\\\\\\\\\\\

router.get("/fetchcitys", function (req, res) {
  pool.query(
    "select * from cities where stateid=?",
    [req.query.stateid],
    function (error, result) {
      if (error) {
        res.status(500).json([]);
      } else {
        res.status(200).json({ data: result });
      }
    }
  );
});

///////////////////-----------> Employee Data Submittt <--------------\\\\\\\\\\\\\\\

router.post("/empsubmit", upload.single("pic"), function (req, res) {
  pool.query(
    "insert into employee_details (emp_firstname, emp_lastname, gender, dob, phoneno, address, state, city, picture)values(?,?,?,?,?,?,?,?,?)",
    [
      req.body.fname,
      req.body.lname,
      req.body.gender,
      req.body.dob,
      req.body.phoneno,
      req.body.address,
      req.body.state,
      req.body.city,
      req.file.originalname,
    ],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("empinterface", { message: "Server Error" });
      } else {
        res.render("empinterface", {
          message: "Record Submitted Successfully!!",
        });
      }
    }
  );
});

//////////////// -----------> Display All Employee Data <----------\\\\\\\\\\\\\\\\\\

router.get("/empdisplay", function (req, res) {
  var admin = JSON.parse(localStorage.getItem("ADMIN"));
  if (!admin) {
    res.render("adminlogin", { message: "" });
  } else {
    pool.query(
      "select Em.*,(select S.statename from states S where S.stateid=Em.state) as state, (select C.cityname from cities C where C.cityid=Em.city) as city from employee_details Em",
      function (error, result) {
        if (error) {
          console.log(error);
          res.render("empdisplay", { data: [], message: "Server Error" });
        } else {
          res.render("empdisplay", { data: result, message: "Successfull!!" });
        }
      }
    );
  }
});

////////////////// ---------> Search Employee By Id <------------\\\\\\\\\\\\\\

router.get("/searchbyid", function (req, res) {
  pool.query(
    "select Em.*,(select S.statename from states S where S.stateid=Em.state) as state, (select C.cityname from cities C where C.cityid=Em.city) as city from employee_details Em where empid=?",
    [req.query.eid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("empmodify", { data: [], message: "Server Error" });
      } else {
        res.render("empmodify", { data: result[0], message: "Successfull!!" });
      }
    }
  );
});

////////////////// ---------> Search Employee By Id  For Picture <------------\\\\\\\\\\\\\\

router.get("/searchbyidpic", function (req, res) {
  pool.query(
    "select Em.*,(select S.statename from states S where S.stateid=Em.state) as state, (select C.cityname from cities C where C.cityid=Em.city) as city from employee_details Em where empid=?",
    [req.query.eid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.render("empmodifypic", { data: [], message: "Server Error" });
      } else {
        res.render("empmodifypic", {
          data: result[0],
          message: "Successfull!!",
        });
      }
    }
  );
});

///////////////////-----------> Employee Modification (Edit / Delete) <--------------\\\\\\\\\\\\\\\

router.post("/emp_edit_del", function (req, res) {
  if (req.body.button == "Edit") {
    pool.query(
      "update employee_details set emp_firstname=?, emp_lastname=?, gender=?, dob=?, phoneno=?, address=?, state=?, city=? where empid=?",
      [
        req.body.fname,
        req.body.lname,
        req.body.gender,
        req.body.dob,
        req.body.phoneno,
        req.body.address,
        req.body.state,
        req.body.city,
        req.body.empid,
      ],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/employee/empdisplay");
        } else {
          res.redirect("/employee/empdisplay");
        }
      }
    );
  } else {
    pool.query(
      "delete from employee_details where empid=?",
      [req.body.empid],
      function (error, result) {
        if (error) {
          console.log(error);
          res.redirect("/employee/empdisplay");
        } else {
          res.redirect("/employee/empdisplay");
        }
      }
    );
  }
});

///////////////////-----------> Employee Picture Modification (Upload) <--------------\\\\\\\\\\\\\\\

router.post("/emp_edit_pic", upload.single("pic"), function (req, res) {
  pool.query(
    "update employee_details set picture=? where empid=?",
    [req.file.originalname, req.body.empid],
    function (error, result) {
      if (error) {
        console.log(error);
        res.redirect("/employee/empdisplay");
      } else {
        res.redirect("/employee/empdisplay");
      }
    }
  );
});

module.exports = router;

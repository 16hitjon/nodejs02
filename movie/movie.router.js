const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const {
  viewAction,
  listAction,
  removeAction,
  editAction,
  saveAction,
  importAction
} = require("./movie.controller");
router.get("/", listAction);
router.get("/remove/:id", ensureLoggedIn("/login"), removeAction);
router.get("/edit/:id?", ensureLoggedIn("/login"), editAction);
router.get("/view/:id", viewAction);
router.post("/save", ensureLoggedIn("/login"), saveAction);
router.post("/import", importAction);
 
module.exports = router;

 
<h2>Login</h2>

<form method='POST' action='/session'>

  <input type='hidden' name='redir' value='<%= redir %>'>

  <div>
    <label for="login">Login:</label>
    <br />
    <input type="text" id="login" name="login" size="30" />
  </div>

  <div>
    <label for="password">Password:</label>
    <br />
    <input type="password" id="password" name="password" size="30" />
  </div>

  <div>
    <input name="commit" type="submit" value="Login" />
  </div>

</form>
### MS OATH2.0
1. When user signs in with their microsoft ac, it returns a callback with a CODE with a validity of few minutes
2. Backend service needs to send a request to ms oauth endpoint with CODE & app clients info
3. This will return a short lived ACCESS TOKEN (1HR validity), and a REFRESH TOKEN (90DAYS validity)
4. Refresh token will be revoked before 90DAYS, if
    a. User resets password
    b. User revoked consent to our APP
    c. Workspace admin restrictions
    d. other


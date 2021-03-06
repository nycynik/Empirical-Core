function _isPreviewSession(data) {
  const previewIdRegExp = RegExp('^prvw\-.+$');
  return previewIdRegExp.test(data.classroomActivityId);
}

function _isRoleAuthorized(permittedRoles, currentRole) {
  return permittedRoles.includes(currentRole);
}

function _belongsToSession(data, token) {
  return data.classroomActivityId == token.data.classroom_activity_id;
}

function _reportError(errorText, data, token, client) {
  console.error({ error: errorText, data, token });
  client.emit(errorText, { data, token });
}

function _checkToken(token, callback) {
  if (token.isValid) {
    callback();
  } else {
    _reportError('invalidToken', data, token, client);
  }
}

export function authorizeSession(data, token, client, callback) {
  _checkToken(token, () => {
    const belongsToSession = _belongsToSession(data, token)

    if (belongsToSession || _isPreviewSession(data)) {
      callback();
    } else {
      _reportError('unauthorizedSession', data, token, client);
    }
  });
}

export function authorizeTeacherSession(data, token, client, callback) {
  _checkToken(token, () => {
    const userIsTeacher    = _isRoleAuthorized(['staff', 'teacher'], token.data.role);
    const belongsToSession = _belongsToSession(data, token);
    const isValidSession   = userIsTeacher && belongsToSession;

    if (isValidSession || _isPreviewSession(data)) {
      callback();
    } else {
      _reportError('unauthorizedTeacherSession', data, token, client);
    }
  });
}

export function authorizeRole(permittedRoles, data, token, client, callback) {
  _checkToken(token, () => {
    const isRoleAuthorized = _isRoleAuthorized(permittedRoles, token.data.role);

    if (isRoleAuthorized || _isPreviewSession(data)) {
      callback();
    } else {
      _reportError('unauthorizedRole', data, token, client);
    }
  });
}

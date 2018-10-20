Make async actions easy.

**Redux-Observable** is the great library based on **Rxjs** and helps you to handle side-effects of **Redux** managable application.

To reduce the boilerplate of handling async actions, I've created the **redux-async-epic**. It includes async-epic itself and gives you some handy helpers to manage outgoing actions.

[![Travis (.org)](https://img.shields.io/travis/biirus/redux-async-epic.svg)](https://travis-ci.org/biirus/redux-async-epic)
[![codecov](https://codecov.io/gh/biirus/redux-async-epic/branch/master/graph/badge.svg)](https://codecov.io/gh/biirus/redux-async-epic)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Instalation

To install the stable version:

```
npm install --save redux-async-epic
```

This assumes you are using [npm](https://www.npmjs.com/) as your package manager.

## Dependencies

The library depends only on **rxjs** but also has 2 peer dependencies:

- redux-observable
- redux

## Why do I need it?

Usually async actions includes 3 major steps:

- request (turn on _pending_ status)
- wait for response
- response (turn of _pending_ status)

That's why you have to keep minimum three actions:

- `{type: "fetch"}`
- `{type: "success"}`
- `{type: "failure"}`

_if you want to abort the process you will need a fourth action_

- `{type: "abort"}`

So, each time when you working with it using _redux-observable_ you have to make something like this:

```js
// epic.js

import { types, fullfill, failure } from "./actions";

const epic = (action$) => (
  action$.pipe(
    ofType(types.fetch),
    mergeMap(action =>
      ajax(action.payload).pipe(
        map(success),
        takeUntil(action$.pipe(
          ofType(types.abort)
        ))
        catchError(failure)
      )
    )
  )
)
```

A boilerplate action creators.

```js
// actions.js

export const types = {
  fetch: "fetch",
  success: "success",
  failure: "failure",
  abort: "abort"
};

export const fetch = payload => ({
  type: types.fetch,
  payload
});

export const success = payload => ({
  type: types.success,
  payload
});

export const failure = error => ({
  type: types.failure,
  error
});

export const abort = () => ({
  type: types.abort
});
```

And finally the reducer:

```js
// reducer.js

import { types } from "./actions";

const initialState = { uiStatus: "idle", items: [], error: null };

export default (state = initialState, action) => {
  switch (action.type) {
    case types.fetch: {
      return {
        ...state,
        uiStatus: "pending"
      };
    }

    case types.success: {
      return {
        ...state,
        uiStatus: "success",
        items: action.payload
      };
    }

    case types.failure: {
      return {
        ...state,
        uiStatus: "failure",
        error: action.error
      };
    }

    case types.abort: {
      return {
        ...state,
        uiStatus: "idle"
      };
    }

    default: {
      return state;
    }
  }
};
```

There is lot of boilerplate code, isn't it?

## Could it be better?

It's time to **redux-async-epic** to shine! To use it, you need to combine async epic to your **root epic**.

```js
// root-epic.js

import { combineEpics } from "redux-observable";
import { asyncEpic } from "redux-async-epic";

export const rootEpit = combineEpics(asyncEpic); // more of your epics
```

Now you should define your async action as [_flux-standard-action_](https://github.com/redux-utilities/flux-standard-action):

```js
// actions.js

import { async, getAbortType } from "redux-async-epic";

export const types = {
  fetch: "fetch"
};

export const fetch = payload => ({
  type: types.fetch,
  payload,
  meta: {
    [async]: true,
    method: ({ payload }) => ajax(payload)
  }
});

export const abort = () => ({
  type: getAbortType(types.fetch) // generates: fetch/abort
});
```

That's it!

- You don't need to create **more actions** to handle response or pending status
- You don't need to create **epic** that handles the _fetch_ action

And finally the reducer:

```js
// reducer.js
import { getSuccessType, getFailureType, getAbortType } from "redux-async-epic";

// you can reduce a boilerpalte even more by using "redux-actions"
import { handleActions } from "redux-actions";
import { types } from "./actions";

const initialState = { uiStatus: "idle", items: [], error: null };

export default handleActions({
  [types.fetch]: state => {
    return {
      ...state,
      uiStatus: "pending"
    };
  },

  [getSuccessType(types.fetch)]: (state, action) => {
    return {
      ...state,
      uiStatus: "success",
      items: action.payload
    };
  },

  [getFailureType(types.fetch)]: (state, action) => {
    return {
      ...state,
      uiStatus: "failure",
      error: action.payload
    };
  },

  [getAbortType]: state => {
    return {
      ...state,
      uiStatus: "idle"
    };
  }
});
```

## How it works?

When _epic_ gets an _async_ action it generates three more actions:

- `{type: "fetch"}`
- `{type: "fetch/pending", payload: true}`
- `{type: "fetch/success"}` or `{type: "fetch/failure"}`
- `{type: "fetch/pending", payload: false}`

When async action is pending it also is listening the `{type: "fetch/abort"}` action, to break the execution.

## The benefits

### Showing background process

As you can see, each time when _async_ action fires it follows by 2 `pending` actions. That's why you can listen for it and make a _global_ UI spinner.

### Global error handler

When _async_ action is failed **redux-async-epic** generates a special `failure` action which looks like that:

```js
{
  type: "async-action/failure",
  error: "something went wront",
  meta: [
    [failure]: true,
    originalPayload: {
      user: "admin"
    }
  ]
}
```

Where **failure** is a special unique symbol.
Here the example how you can make a global error handler:

```js
// global failure epic
import { isFailureAction } from "redux-async-epic";
import { filter, tap, ignoreElements } from "rxjs/operators";

// just for example
import { clearCredentials } from "./session/lib";
import { logUnauthorizedAccess } from "./analytics";
import { redirectToErrorPage } from "./router";

export default action$ =>
  action.pipe(
    filter(isFailureAction),
    filter(({ error }) => error.status === 403),
    tap(action => {
      clearCredentials();
      logUnauthorizedAccess(action);
      redirectToErrorPage();
    }),
    ignoreElements()
  );
```

## Fire another action on succes

In this example we are requiring first 10 comments, and when request is fulfilled we fire another request to get next page of comments.

```js
// helper
const commentRequest = ({ payload }) =>
  ajax({
    url: "https://comments.server.com",
    method: "post",
    body: payload
  });

// primary action
const fetchComments = (
  payload = {
    offset: 0,
    limit: 10
  }
) => ({
  type: "fetch",
  payload,
  meta: {
    [async]: true,
    method: commentRequest,
    onSuccess: () => prefetchNextPage(payload)
  }
});

// on-success action
const prefetchNextPage = payload => {
  const config = {
    ...payload,
    offset: payload.offset + payload.limit
  };

  return {
    type: "prefetch",
    payload: config,
    meta: {
      [async]: true,
      method: commentRequest
    }
  };
};
```

You can fire even more actions by passing an array of them:

```js
onSuccess: () => [first(), second(), third()];
```

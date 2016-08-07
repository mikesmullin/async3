# async3.js

Procedural asynchronous flow control for JavaScript in Node.JS and browsers.

For people who find continuation passing style (CPS) more reasonable than Promises, Futures, generators, etc.

Inspired by [async2](https://github.com/caolan/async),
[mini-async](https://github.com/mikesmullin/mini-async).

### Motivation

Javascript, like many languages
that support passing callbacks to asynchronous APIs,
provides flow control keywords (i.e, `if`, `while`, `for`)
that are nearly useless once you need to await the future
result.

At some point you realize you need to take a procedural approach
and reimplement these keywords as functions.

In doing so, if you are familiar with assembly or machine code,
you may realize that all flow control operations can actually
be reduced to conditional JMP opcodes. Trendy variations like
`unless`, `until`, `do...while`, etc. are unecessary 
syntactic sugar.

Taking the minimalist approach, you realize you can get a large
degree of control with just a few functions that are a few
lines of code each. No need for object instantiations,
or multiple function calls in a builder pattern.

### Include

ES6 Node.JS:
```javascript
const {ifAsync} = require('async3');
```

### Flow Control Functions

* [ifAsync](./README.md#user-content-async3ifasync) : conditional branching without two callback references
* [whileAsyncSerial](./REAMDE.md#): latched infinite loop
* [forEachAsyncSerial](./REAMDE.md#) : serial one-at-a-time invocation
* [forEachAsyncParallel](./REAMDE.md#) : parallel branch-join invocation
* [forEachAsyncParallelBatch](./REAMDE.md#) : parallel with limited maximum concurrent invocations

#### Async3.ifAsync()

For when you have two functions:
one that is asynchronous but is only executed sometimes,
and one that is called afterward.
Without this, you'd have to declare or reference
the second function twice.

##### Syntax

```
void ifAsync(test, true_cb[, ...args], done_cb);
```

###### Parameters

* **test**  
  Truthy value determines whether to invoke `true_cb`.

* **true_cb**  
  The function invoked if the `test` function above returns truthy.
  Accepts no targ
  Expected to be asynchronous.
  Accepts arguments provided in `...args` parameter described below.
  Void return value.

* **...args**  
  Optional.
  One or more arguments of any type, to be passed into `true_cb` function.

* **done_cb**  
  Function invoked after `true_cb` completes.
  Invoked regardless of whether `test` returned truthy.

##### Example

```javascript
ifAsync(tmpAbsPath != absPath,
  exec, 'mv "'+ tmpAbsPath +'" "'+ absPath +'"', () =>
{
  console.log('placed locally for later static upload to cdn as '+ relPath);
});
```

import Reactable from './Reactable'
import './react-table.css'
import './reactable.css'

export * from './Reactable'

// from htmlwidgets ----
// Attempt eval() both with and without enclosing in parentheses.
// Note that enclosing coerces a function declaration into
// an expression that eval() can parse
// (otherwise, a SyntaxError is thrown)
function tryEval(code) {
  var result = null;
  try {
    result = eval("(" + code + ")");
  } catch(error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }
    try {
      result = eval(code);
    } catch(e) {
      if (e instanceof SyntaxError) {
        throw error;
      } else {
        throw e;
      }
    }
  }
  return result;
}

function replaceWithEval(obj, fields) {
  for (let field of fields) {
    if (obj[field] && typeof obj[field].code === 'string') {
      var res = tryEval(obj[field].code)

      if (typeof res === 'function') {
          console.log("replacing", field, obj[field], res)
          obj[field] = res
      }

    }
  }
  return obj
}

function mapReplaceWithEval(obj, field) {

    if (obj === undefined) {
      return obj
    }
    if (!Array.isArray(obj)) {
      return obj
    }
    
    var res = obj.map((x) => replaceWithEval(x, field));

    return res
}


export default function Reactable2({
    data,
    columns,
    ...rest
}) {
  var colProps = ['filterMethod', "footer", "cell", "details", "style"];
  var tableProps = ["rowStyle", "rowClass", "onClick"];
  var columns = mapReplaceWithEval(columns, colProps);
  var rest = replaceWithEval(rest, tableProps);
  return Reactable({
    data,
    columns,
    ...rest
  })

}

Reactable2.propTypes = Reactable.propTypes
Reactable2.defaultProps = Reactable.defaultProps
//export default Reactable
content = (tag/text)*

tag = helper / prop

prop = "{{" p:id "}}" { return { prop: p } } 

args = a:(_ id)* { return a.map(x=>x[1]); }

helper = voidHelper / nonVoidHelper

voidHelper = "{{#" n:id a:args "/}}" {
    return {
        type: n,
        args: a,
        content: []
    }
}

nonVoidHelper = "{{#" n:id a:args "}}" c:content "{{/" e:id "}}" &{ return n == e; }
{
    return {
        type: n,
        args: a,
        content: c
    }
}

text = a:(!("{{").)+ { return { text: a.map(x=>x[1]).join("") }; }

id = r:([A-Z]/[a-z]/[0-9]/".")+ { return r.join(""); }

_ = " "*


mdfile = f:mdblock b:(_n+ mdblock)* { return [f].concat(b.map(x=>x[1])).join("\n"); }

mdblock = b:(codeblock / table / heading / callout / blockquote / ul / ol / para/ nope) { return b; }

table = h:throw t:(_n trow)* { return "<table>" + h + "<tbody>\n" + t.map(x=>x[1]).join("\n") + "</tbody></table>" }

throw = "|" h:tcell+ _n thmark 
{ return "<thead><tr>" + h.map(x=>"<th>" + x + "</th>").join("") + "</tr></thead>" }

thmark = ("|" "-"+)+ "|"

tcell = f:(!"|" inlineatom)* "|" { return f.map(x=>x[1]).join(""); }

trow = "|" h:tcell+
{ return "<tr>" + h.map(x=>"<td>" + x + "</td>").join("") + "</tr>" }

heading = l:"#"+ " " t:inlinetext { var h = "h" + l.length; return "<" + h + " id=\"h" + text().replace(/\W+/g, "-").toLowerCase() +  "\">" + t + "</" + h + ">"  }

callout = f:coline+ { return "<aside class=\"" + f[0][0]  + "\">" + f.map(x=>x[2]).join("\n") + "</aside>" }
coline = exclaim "> " t:inlinetext
exclaim = c:[^A-Za-z0-9] { 
var n = {
  "!": "ex",
  "?": "qu",
  "@": "at",
  "#": "hs",
  "$": "ny",
  "%": "pr",
  "^": "ct",
  "&": "nd",
  "*": "sr",
  "(": "po",
  ")": "pc",
  "-": "hy",
  "_": "un",
  "=": "eq",
  "+": "pl",
  "'": "sq",
  "\"": "dq"
}
return "exclaim-type-" + n[c];

}

blockquote = f:bqline+ { return "<blockquote>" + f.join("\n") + "</blockquote>" }
bqline = "> " t:inlinetext { return t; }

ul = h:uli t:( _n uli )* { return "<ul>\n" + [h].concat(t.map(x=>x[1])).join("\n") + "\n</ul>" }
uli = ("* " / "- ") t:inlinetext { return "<li>" + t + "</li>" }

ol = h:oli t:( _n oli )* { return "<ol>\n" + [h].concat(t.map(x=>x[1])).join("\n") + "\n</ol>" }
oli = (num ("." / ")") " ") t:inlinetext { return "<li>" + t + "</li>" }

codeblock = "```" l:cbtag? t:cbtxt* "```" { return "<pre class=\"md-codeblock\"><code data-lang=\"" + l + "\">" + t.join("") + "</code></pre>";}

cbtag = t:[a-z]+ _n { return t.join(""); } 

cbtxt = !"```" c:. { return c; }

para = h:inlinetext t:(_n inlinetext)* { return "<p>" + [h].concat(t.map(x=>x[1])).join("\n") + "</p>"; }

inlinetext = t:inlineatom+ { return t.join("") }

inlineatom = escaped / plainchar / bold / italics / link / inlinecode / barespecial

escaped = "\\" t:. { return t; } 

bold = "**" t:(!"**" inlineatom)* "**" { return "<strong>" + t.map(x=>x[1]).join("") + "</strong>"; }

italics = "*" t:(!"*" inlineatom)* "*" { return "<em>" + t.map(x=>x[1]).join("") + "</em>"; }

struck = "~~" t:(!"~~" inlineatom)* "~~" { return "<del>" + t.map(x=>x[1]).join("") + "</del>"; }

inlinecode = "`" t:(!"`" inlineatom)* "`" { return "<code>" + t.map(x=>x[1]).join("") + "</code>" } 

link = "[" t:(!"]" inlineatom)* "]" "(" l:(!")" inlineatom)* ")" 
{ return "<a href=\"" + l.map(x=>x[1]).join("") + "\">" + t.map(x=>x[1]).join("") + "</t>" } 
	
plaintext = t:plainchar+ { return t.join("") }

plainchar = entity / !barespecial t:[^\n] {return t}

barespecial = "*" / "~" / "[" / "]" / "(" / ")" / "`" / "#" / "|"

entity = "&" { return "&amp;" }

_n = "\n"
num = [0-9]+

nope = ""
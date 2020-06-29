// $ deno test test.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import num from "./Num.ts";
import addOne from "./Fun.ts";

Deno.test("title", () => {
  const h1 = "My first blog";
  assertEquals(h1, "My first blog");
});

Deno.test("import", () => {
	assertEquals('123', num);
});

Deno.test("add", () => {
	console.log(addOne(1));
	assertEquals(1+1, addOne(1));
});

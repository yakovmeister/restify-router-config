import { expect } from 'chai'
import { sortRoutes } from "@module/sorting/sortRoutes";
import { routes } from "../__data__/routes";

describe("sortRoutes", () => {
  it("should group string based on the number of slashes", () => {

    const result = sortRoutes(routes);

    console.log(result)

  });
});

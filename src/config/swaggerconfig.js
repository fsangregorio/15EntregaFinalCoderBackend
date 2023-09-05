
export const swaggerOptions = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentation",
        description: "Documentation",
        contact: {
          name: "John Doe",
          email: "johndoe123@gmail.com",
        },
      },
    },
    apis: [`./docs/**/*.yaml`],
  };

module.exports = ({ config }) => {
  return {
    ...config,
    extra: {
      clerkPublishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    },
  };
};

// SafeMode Auth — Supabase Magic Link
(function () {
  var SUPABASE_URL = 'https://mrnccntqmkxjazznejfc.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ybmNjbnRxbWt4amF6em5lamZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMDA3NTksImV4cCI6MjA5MDc3Njc1OX0.T6oFTtYiFTsx6ojuogpZFXAS7tN5-dPzwvmY5V2xFGI';

  var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  window.safemodeAuth = {
    client: client,

    signIn: function (email) {
      return client.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
    },

    getSession: function () {
      return client.auth.getSession();
    },

    getUser: function () {
      return client.auth.getUser();
    },

    signOut: function () {
      return client.auth.signOut();
    },

    onAuthStateChange: function (callback) {
      return client.auth.onAuthStateChange(callback);
    }
  };
})();

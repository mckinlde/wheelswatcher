{
  description = "Node.js development environment";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs_20  # or pkgs.nodejs_18 or pkgs.nodejs_latest depending on your version needs
          pkgs.yarn
        ];

        shellHook = ''
          echo "Welcome to the Node.js dev shell!"
        '';
      };
    });
}

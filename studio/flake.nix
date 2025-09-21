{
  inputs = {
    # nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs = {
    self,
    systems,
    nixpkgs,
    ...
  } @ inputs: let
    eachSystem = f:
      nixpkgs.lib.genAttrs (import systems) (
        system:
          f {
            pkgs = import nixpkgs {
              inherit system;
              overlays = [];
            };
            inherit system;
          }
      );
  in {
    packages = eachSystem ({
      pkgs,
      system,
    }: let
      lib = nixpkgs.lib;
      packageJson = lib.importJSON ./package.json;
      cleanName = lib.last (lib.split "/" packageJson.name);

      app-src = pkgs.mkYarnPackage {
        inherit (packageJson) name version;
        src = ./.;
        packageJson = ./package.json;
        yarnLock = ./yarn.lock;

        buildPhase = ''
          yarn --offline --frozen-lockfile build
        '';
        distPhase = "true";
      };
    in rec {
      inherit app-src;
      default = pkgs.writeShellApplication {
        name = cleanName;
        runtimeInputs = [app-src pkgs.nodejs];
        text = ''
          ${pkgs.nodejs}/bin/node ${app-src}/libexec/${packageJson.name}/deps/${packageJson.name}/build/server.js
        '';
      };
      docker = pkgs.dockerTools.buildLayeredImage {
        name = cleanName;
        tag = packageJson.version;
        contents = [pkgs.nodejs default];
        config = {
          Entrypoint = ["${pkgs.dumb-init}/bin/dumb-init" "--"];
          Cmd = ["${default}/bin/${cleanName}"];
          ExposedPorts = {"3000/tcp" = {};};
        };
      };
    });
    devShells = eachSystem ({pkgs, ...}: {
      default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs
          corepack

          nodePackages.typescript
          nodePackages.typescript-language-server
          svelte-language-server
          tailwindcss-language-server

          prettierd
        ];
      };
    });
  };
}

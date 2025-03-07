import { Request, Response } from "express";
import { AppDataSource } from "../database/data-source";
import Autor from "../entities/Autor";

class AuthosController {
  private authorsRepository;

  constructor() {
    this.authorsRepository = AppDataSource.getRepository(Autor);
  }

  // Criar um autor
  create = async (req: Request, res: Response) => {
    try {
      const authorsBody = req.body as Autor;

      if (!authorsBody || !authorsBody.name || !authorsBody.nationality) {
        res.status(400).json("Preencha todos os dados obrigatórios!");
        return;
      }

      // Salvar o auditório no banco de dados
      const autor = await this.authorsRepository.save(authorsBody);

      res.status(201).json(autor);
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };

  // Buscar todos os autores: Retornar uma lista de todos os autores cadastrados permitindo pesquisar por nome.
  getAll = async (req: Request, res: Response) => {
    try {
      const nome = req.query.name as string;

      let autores = [] as Autor[];

      if (nome) {
        autores = await this.authorsRepository.find({
          where: { name: nome },
        });
      } else {
        autores = await this.authorsRepository.find();
      }
      res.status(200).json(autores);
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };

  // Buscar um autor específico: Permitir ao usuário buscar um autor por ID.
  getByID = async (req: Request, res: Response) => {
    try {
      const result = await this.authorsRepository.findOne({
        where: {
          id: Number(req.params.id),
        },
      });

      if (!result) {
        res.status(200).json("Nenhum autor encontrado!");
        return;
      }

      res.status(200).json(result);
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };
  // Atualizar as informações de um autor: Permitir ao usuário atualizar o nome, biografia, data de nascimento, nacionalidade e se o autor está ativo.
  put = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const autorBody = req.body as Autor;

      const autor = await this.authorsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!autor) {
        res.status(200).json("Nenhum autor encontrado!");
        return;
      }

      Object.assign(autor, autorBody);

      await this.authorsRepository.save(autor);

      res.status(200).json(autor);
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };
  // Deletar um autor: Permitir ao usuário remover um autor da biblioteca.
  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      const autor = await this.authorsRepository.findOne({
        where: {
          id: id,
        },
      });

      if (!autor) {
        res.status(200).json("Nenhum autor encontrado!");
        return;
      }

      await this.authorsRepository.delete(autor);

      res.status(200).json("Autor removido com sucesso!");
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };
  // Autores do mês: uma rota que liste todos os autores que tem data de nascimento no mês atual.
  autoresMes = async (req: Request, res: Response) => {
    try {
      const mesAtual = () => new Date().getMonth() + 1;
      let autores = [] as Autor[];
      if (!autores) {
        res.status(200).json("Nenhum autor encontrado!");
        return;
      } else {
        autores = await this.authorsRepository.find();
      }
      const autoresFiltrados = autores.filter((autor) => {
        const mesNascimento = new Date(autor.birthdate).getMonth() + 1;
        return Number(mesNascimento) === Number(mesAtual);
      });
      res.status(200).json(autoresFiltrados);
    } catch (er) {
      res.status(500).json("Não foi possível executar a solicitação!");
    }
  };
}

export default AuthosController;

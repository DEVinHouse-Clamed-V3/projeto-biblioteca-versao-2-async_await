
import { Request, Response, Router } from "express";
import { AppDataSource } from "../database/data-source";
import { Auditorio } from "../entities/Auditorio";
import { MoreThanOrEqual } from "typeorm";

const auditorioRoutes = Router();

const auditoriumRepository = AppDataSource.getRepository(Auditorio);

// Criar um novo auditório
auditorioRoutes.post("/", async (req: Request, res: Response) => {
    try {
        const auditoriumBody = req.body as Auditorio;

        if (!auditoriumBody || !auditoriumBody.name || !auditoriumBody.capacity || !auditoriumBody.location) {
            res.status(400).json("Preencha todos os dados obrigatórios!");
            return;
        }

        // Salvar o auditório no banco de dados
        await auditoriumRepository.save(auditoriumBody);

        res.status(201).json(auditoriumBody);
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

// Buscar todos os auditórios (com filtro de nome e capacidade)
auditorioRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const { name, capacity } = req.query;

        const page = Number(req.query.page ?? 1);
        const limit = Number(req.query.limit ?? 10);

        const skip = page > 1 ? (page - 1) * limit : 0;

        const result = await auditoriumRepository.find({
            where: {
                name: name ? `%${name}%` : undefined,
                capacity: capacity ? parseInt(capacity as string) : undefined,
            },
            skip: skip,
            take: limit,
        });

        if (!result) {
            res.status(200).json("Nenhum auditório encontrado!");
            return;
        }

        res.status(200).json(result);
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

// Buscar um auditório específico por ID
auditorioRoutes.get("/:id", async (req: Request, res: Response) => {
    try {
        const result = await auditoriumRepository.findOne({
            where: {
                id: Number(req.params.id),
            },
        });

        if (!result) {
            res.status(200).json("Nenhum auditório encontrado!");
            return;
        }

        res.status(200).json(result);
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

// Atualizar um auditório existente
auditorioRoutes.put("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const auditoriumBody = req.body as Auditorio;

        const auditorium = await auditoriumRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!auditorium) {
            res.status(200).json("Nenhum auditório encontrado!");
            return;
        }

        // Atualizar as propriedades do auditório com os dados fornecidos
        Object.assign(auditorium, auditoriumBody);

        await auditoriumRepository.save(auditorium);

        res.status(200).json(auditorium);
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

// Deletar um auditório
auditorioRoutes.delete("/:id", async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        const auditorium = await auditoriumRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!auditorium) {
            res.status(200).json("Nenhum auditório encontrado!");
            return;
        }

        await auditoriumRepository.remove(auditorium);

        res.status(200).json("Auditório removido com sucesso!");
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

// Buscar auditórios com capacidade >= 300, com projetor e sistema de som
auditorioRoutes.get("/concepts", async (req: Request, res: Response) => {
    try {
        const result = await auditoriumRepository.find({
            where: {
                capacity: MoreThanOrEqual(300),
                has_projector: true,
                has_sound_system: true,
            },
        });

        if (!result) {
            res.status(200).json("Nenhum auditório com as características solicitadas!");
            return;
        }

        res.status(200).json(result);
    } catch (ex) {
        res.status(500).json("Não foi possível executar a solicitação!");
    }
});

export default auditorioRoutes;

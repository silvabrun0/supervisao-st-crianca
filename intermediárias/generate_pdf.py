#!/usr/bin/env python3
import sys
import os
import zlib

class SimplePDF:
    def __init__(self, filename, pagesize=(595.28, 841.89)): # A4
        self.filename = filename
        self.width, self.height = pagesize
        self.pages = []
        self.current_page_stream = []
        self.font_helvetica = "F1"
        self.font_helvetica_bold = "F2"

    def new_page(self):
        if self.current_page_stream:
            self.pages.append("".join(self.current_page_stream))
            self.current_page_stream = []

    def add_stream(self, s):
        self.current_page_stream.append(s)

    def draw_rect(self, x, y, w, h, fill_rgb=None, stroke_rgb=None, line_width=1):
        s = f"q {line_width} w "
        if stroke_rgb:
            s += f"{stroke_rgb[0]} {stroke_rgb[1]} {stroke_rgb[2]} RG "
        if fill_rgb:
            s += f"{fill_rgb[0]} {fill_rgb[1]} {fill_rgb[2]} rg "
        s += f"{x:.2f} {y:.2f} {w:.2f} {h:.2f} re "
        if fill_rgb and stroke_rgb:
            s += "B Q\n"
        elif fill_rgb:
            s += "f Q\n"
        elif stroke_rgb:
            s += "S Q\n"
        else:
            s += "n Q\n"
        self.add_stream(s)

    def draw_text(self, text, x, y, size=10, bold=False, rgb=(0.1, 0.1, 0.1)):
        t_clean = text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')
        trans = {
            '•': '-', '—': '-', '–': '-', '→': '->', '➔': '->',
            '“': '"', '”': '"', '‘': "'", '’': "'", 'Δ': 'Delta ',
            '🟢': '[OK]', '⚪': '[--]', '🔴': '[!]', '📦': '',
            '✅': '[OK]', '±': '+/-', '≤': '<='
        }
        for k, v in trans.items():
            t_clean = t_clean.replace(k, v)
        try:
            t_clean.encode('latin1')
        except UnicodeEncodeError:
            t_clean = t_clean.encode('latin1', 'replace').decode('latin1')
            t_clean = t_clean.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

        font = self.font_helvetica_bold if bold else self.font_helvetica
        s = f"BT /{font} {size} Tf {rgb[0]} {rgb[1]} {rgb[2]} rg 1 0 0 1 {x:.2f} {y:.2f} Tm ({t_clean}) Tj ET\n"
        self.add_stream(s)

    def save(self):
        if self.current_page_stream:
            self.pages.append("".join(self.current_page_stream))
            self.current_page_stream = []

        num_pages = len(self.pages)
        page_obj_indices = []

        curr_obj_id = 5
        for i in range(num_pages):
            page_obj_indices.append(curr_obj_id)
            curr_obj_id += 2

        xref = {}
        pdf_bytes = bytearray(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")

        def add_object(obj_num, data):
            xref[obj_num] = len(pdf_bytes)
            pdf_bytes.extend(f"{obj_num} 0 obj\n".encode('ascii'))
            if isinstance(data, str):
                pdf_bytes.extend(data.encode('latin1'))
            else:
                pdf_bytes.extend(data)
            pdf_bytes.extend(b"\nendobj\n")

        add_object(1, "<< /Type /Catalog /Pages 2 0 R >>")
        kids = " ".join([f"{idx} 0 R" for idx in page_obj_indices])
        add_object(2, f"<< /Type /Pages /Kids [{kids}] /Count {num_pages} >>")
        add_object(3, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>")
        add_object(4, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>")

        c_id = 5
        for i, page_stream in enumerate(self.pages):
            p_obj_id = c_id
            cnt_obj_id = c_id + 1
            c_id += 2

            c_bytes = page_stream.encode('latin1')
            comp_bytes = zlib.compress(c_bytes)
            cnt_data = f"<< /Length {len(comp_bytes)} /Filter /FlateDecode >>\nstream\n".encode('ascii') + comp_bytes + b"\nendstream"
            page_data = f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 {self.width:.2f} {self.height:.2f}] /Contents {cnt_obj_id} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>"

            add_object(p_obj_id, page_data)
            add_object(cnt_obj_id, cnt_data)

        start_xref = len(pdf_bytes)
        total_objs = curr_obj_id
        pdf_bytes.extend(f"xref\n0 {total_objs}\n0000000000 65535 f \n".encode('ascii'))
        for o in range(1, total_objs):
            pos = xref[o]
            pdf_bytes.extend(f"{pos:010d} 00000 n \n".encode('ascii'))

        trailer = f"trailer\n<< /Size {total_objs} /Root 1 0 R >>\nstartxref\n{start_xref}\n%%EOF\n"
        pdf_bytes.extend(trailer.encode('ascii'))

        with open(self.filename, 'wb') as f:
            f.write(pdf_bytes)
        print(f"PDF gerado com sucesso em: {self.filename}")


def build_notes_pdf():
    dest_path = os.path.expanduser("~/Desktop/Guia_Anotacoes_Apresentacao_Supervisao_Patos.pdf")
    pdf = SimplePDF(dest_path)

    # Cores (R, G, B de 0 a 1)
    C_NAVY = (0.07, 0.13, 0.25)     # #122240 Azul institucional escuro
    C_BLUE = (0.12, 0.35, 0.65)     # Azul destaque
    C_LIGHT_BG = (0.95, 0.96, 0.98) # Fundo de caixa
    C_TEXT = (0.15, 0.15, 0.18)     # Texto principal
    C_MUTED = (0.42, 0.45, 0.50)    # Texto secundário
    C_BORDER = (0.82, 0.85, 0.90)   # Borda suave
    C_GREEN = (0.10, 0.55, 0.25)    # Verde destaque
    C_TAG_BG = (0.90, 0.94, 0.98)

    # -------------------------------------------------------------
    # PÁGINA 1: CABEÇALHO, VISÃO GERAL E PILARES FUNDAMENTAIS (1 a 8)
    # -------------------------------------------------------------
    # Header Banner
    pdf.draw_rect(0, 755, 595.28, 86.89, fill_rgb=C_NAVY)
    pdf.draw_text("SISTEMA DE SUPERVISAO PEDAGOGICA - SERTAO CRIANCA (PATOS/PB)", 36, 805, size=11, bold=True, rgb=(0.7, 0.8, 0.95))
    pdf.draw_text("GUIA EXECUTIVO DE ANOTACOES PARA APRESENTACAO", 36, 782, size=18, bold=True, rgb=(1, 1, 1))
    pdf.draw_text("Resumo de Evolucao Tecnica e Novas Utilidades (20/10 a 03/11/2026 - v0.90 -> v1.67)", 36, 765, size=9, bold=False, rgb=(0.85, 0.88, 0.92))

    # Box de Abertura / Gancho da Fala
    pdf.draw_rect(36, 685, 523.28, 56, fill_rgb=C_TAG_BG, stroke_rgb=C_BORDER, line_width=1)
    pdf.draw_text("ROTEIRO DE ABERTURA SUGERIDO (NA SUA FALA):", 46, 725, size=9, bold=True, rgb=C_BLUE)
    pdf.draw_text('"Ha duas semanas formalizamos as diretrizes da reuniao de 19/10. Hoje apresento a conclusao de', 46, 710, size=8.5, bold=False, rgb=C_TEXT)
    pdf.draw_text('100% dos 15 pilares pedagogicos e a entrega de novas utilidades essenciais de gestao territorial e dados."', 46, 697, size=8.5, bold=False, rgb=C_TEXT)

    # Seção 1: 15 Pilares
    pdf.draw_text("PARTE 1: CONCLUSAO DOS 15 PILARES PEDAGOGICOS PACTUADOS", 36, 663, size=12, bold=True, rgb=C_NAVY)
    pdf.draw_rect(36, 657, 523.28, 1.5, fill_rgb=C_BLUE)

    pilares_p1 = [
        ("Pilar 1: Unidade de Analise por TURMA", 
         "A observacao avalia o acesso e a rotina da crianca na sala, nao o docente isolado. Regencia compartilhada sem perda historica."),
        ("Pilar 2: Triade Canonica de Governanca", 
         "Oficializacao da 'Coordenadora do Nucleo de EI' (Helena). Isolamento estrito: CP (UE), Formadora (Polo) e Nucleo (Rede)."),
        ("Pilar 3: Comparativo UE vs. Rede no Afunilamento", 
         "Regua comparativa dupla item a item com calculo automatico de Delta (+/-%) para diagnostico imediato de discrepancias."),
        ("Pilar 4: Turmas Integrais em Formulario Unico (2 Etapas)", 
         "Manha e tarde integradas no mesmo fluxo com salvamento de rascunho e bloqueio de docentes vespertinos na etapa matutina."),
        ("Pilar 5: Fechamento Nominal e Atribuicao Mandatoria", 
         "Parecer descritivo aberto em praticas Consistentes (boas praticas) e obrigatoriedade de vincular docente em notas Parciais."),
        ("Pilar 6: Higienizacao 'Visita' -> 'Observacao'", 
         "Erradicacao total de termos policialescos em 100% das telas, botoes, cabecalhos, relatorios e rotas da plataforma."),
        ("Pilar 7: Extincao de Metricas Burocraticas", 
         "Substituicao de 'Visitas Auditadas' e 'N/A' pelo KPI decisorio de Cobertura de Turmas no Bimestre e Meta Anual."),
        ("Pilar 8: Bloco 'Foco nos Menores Indices' (Gargalos)", 
         "Destaque automatico dos 3 pontos criticos da escola ou polo, com alternancia entre Menor Consistencia e Maior Desvio vs Rede.")
    ]

    y_pos = 635
    for tit, desc in pilares_p1:
        pdf.draw_rect(36, y_pos - 3, 523.28, 26, fill_rgb=C_LIGHT_BG, stroke_rgb=C_BORDER, line_width=0.5)
        pdf.draw_text(f"[OK] {tit}", 44, y_pos + 12, size=9, bold=True, rgb=C_NAVY)
        pdf.draw_text(desc, 44, y_pos + 1, size=8, bold=False, rgb=C_TEXT)
        y_pos -= 31

    # Rodapé da Página 1
    pdf.draw_text("Pagina 1 de 2  |  Gestor Supervisao SerTao Crianca  |  Documento gerado para apoio de apresentacao oral", 36, 25, size=8, rgb=C_MUTED)

    # -------------------------------------------------------------
    # PÁGINA 2: PILARES RESTANTES (9 a 15) E NOVAS UTILIDADES
    # -------------------------------------------------------------
    pdf.new_page()

    # Mini Header Página 2
    pdf.draw_rect(0, 805, 595.28, 36.89, fill_rgb=C_NAVY)
    pdf.draw_text("GUIA DE APRESENTACAO (CONTINUACAO) - NOVAS UTILIDADES & IMPACTO", 36, 818, size=11, bold=True, rgb=(1, 1, 1))

    # Pilares 9 a 15
    pdf.draw_text("CONTINUACAO DOS PILARES (USABILIDADE MOBILE, CONTROLE & DADOS)", 36, 785, size=11, bold=True, rgb=C_NAVY)
    pdf.draw_rect(36, 779, 523.28, 1, fill_rgb=C_BLUE)

    pilares_p2 = [
        ("Pilar 9: Usabilidade Mobile (Drawer de Filtros)", "Fim da barra presa no celular: 100% de tela livre com botao gatilho no polegar e Bottom Sheet."),
        ("Pilar 10: Quadro de Controle Bimestral", "Semaforo matricial verde (concluida), cinza (no prazo) e vermelho (atrasada) por turma e docente."),
        ("Pilar 11: Pop-ups Informativos nas Rubricas", "Textos longos recolhidos no celular; icone de apoio abre o criterio oficial sob demanda sem poluir."),
        ("Pilar 12: Painel Exclusivo da Pratica Docente", "Separacao cabal: o painel foca nas criancas e turmas; formacao de gestao tem modulo proprio."),
        ("Pilar 13: Ocorrencias na Turma e Padrao MEC", "Ocorrencias atreladas a turma com status 'Conversado' e termos formais: Tempo Parcial e Integral."),
        ("Pilar 14: Governanca Descentralizada e SSOT", "CP edita sua UE; Formadora edita seu polo; Nucleo edita a rede. Gravacao unica em base compartilhada."),
        ("Pilar 15: Transicao Sistemica da TURMA", "A turma e o eixo dorsal no Cronograma (carrega docentes), no Historico e no Dossie Longitudinal.")
    ]

    y_pos = 758
    for tit, desc in pilares_p2:
        pdf.draw_text(f"[OK] {tit}:", 40, y_pos, size=8.5, bold=True, rgb=C_NAVY)
        pdf.draw_text(desc, 235, y_pos, size=8, bold=False, rgb=C_TEXT)
        y_pos -= 16

    # Seção 2: NOVAS UTILIDADES
    y_pos -= 8
    pdf.draw_text("PARTE 2: NOVAS UTILIDADES DESENVOLVIDAS (ALEM DO PLANEJADO)", 36, y_pos, size=11, bold=True, rgb=C_NAVY)
    pdf.draw_rect(36, y_pos - 6, 523.28, 1.5, fill_rgb=C_BLUE)
    y_pos -= 22

    utilidades = [
        ("Arquitetura Plurianual (Multi-Ano SSOT):", 
         "Alternancia dinamica de anos letivos (2025/2026/2027), assistente de abertura de novo ano e trava contra anos futuros."),
        ("Definicao Autonoma de Prazos Bimestrais:", 
         "O Nucleo de EI parametriza o calendario oficial na plataforma, gerando calculo automatico de prazos no semaforo."),
        ("Governanca Territorial de Polos e Visao Multinivel:", 
         "Gestao de escolas por polos, visualizacao travada da Formadora (Polo vs Rede) e Tabela Executiva macro para Helena."),
        ("Caracterizacao por Turma com Censo de Inclusao (AEE):", 
         "Registro nominal de matriculados e alunos com deficiencia na turma, com agregacao instantanea para UE, Polo e Rede."),
        ("Simplificacao Radical do Cadastro Docente:", 
         "Botao '+ Novo Professor' exige apenas o Nome Completo (sem e-mail/senha) e trava automatica contra dupla alocacao no turno."),
        ("Agenda Integrada com Acesso Direto a Devolutiva:", 
         "Abertura do relatorio da observacao diretamente pelo cronograma, edicao de datas realizadas e hero card da proxima visita."),
        ("Central de Relatorios SSOT e Redesign Hallmark:", 
         "Backups JSON, extracoes CSV responsivas e erradicacao do visual 'vibecode' em favor de sobriedade editorial e SVGs.")
    ]

    for tit, desc in utilidades:
        pdf.draw_rect(36, y_pos - 3, 523.28, 25, fill_rgb=C_LIGHT_BG, stroke_rgb=C_BORDER, line_width=0.5)
        pdf.draw_text(tit, 44, y_pos + 11, size=8.5, bold=True, rgb=C_BLUE)
        pdf.draw_text(desc, 44, y_pos + 1, size=8, bold=False, rgb=C_TEXT)
        y_pos -= 29

    # Box de Conclusão para Apresentação
    y_pos -= 4
    pdf.draw_rect(36, y_pos - 28, 523.28, 30, fill_rgb=C_TAG_BG, stroke_rgb=C_GREEN, line_width=1)
    pdf.draw_text("ARGUMENTO DE FECHAMENTO (CALL TO ACTION):", 46, y_pos - 10, size=8.5, bold=True, rgb=C_GREEN)
    pdf.draw_text('"A plataforma saiu de um prototipo de preenchimento para se tornar um sistema integrado de gestao e tomada de decisao."', 46, y_pos - 22, size=8, bold=False, rgb=C_TEXT)

    # Rodapé da Página 2
    pdf.draw_text("Pagina 2 de 2  |  Gestor Supervisao SerTao Crianca  |  Documento gerado para apoio de apresentacao oral", 36, 25, size=8, rgb=C_MUTED)

    pdf.save()

if __name__ == "__main__":
    build_notes_pdf()

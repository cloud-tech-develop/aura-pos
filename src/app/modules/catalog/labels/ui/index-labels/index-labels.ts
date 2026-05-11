import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { IndexHeaderComponent } from '@shared/components/index-header/index-header.component';
import { TagsService } from '../../services';
import { Product } from '@module-catalog/products/interfaces';
import { LabelProduct, LabelPrintSettings, toLabelProduct } from '../../interfaces';
import { ToastAlertService } from '@services/index';

const STORAGE_KEY = 'aura_pos_label_settings';

@Component({
  selector: 'app-index-labels',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TableModule,
    CheckboxModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    DialogModule,
    SelectButtonModule,
    SliderModule,
    ToggleButtonModule,
    TooltipModule,
    ToastModule,
    IndexHeaderComponent,
  ],
  providers: [MessageService],
  templateUrl: './index-labels.html',
  styleUrl: './index-labels.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexLabels {
  private tagsService = inject(TagsService);
  private toast = inject(ToastAlertService);
  private translate = inject(TranslateService);

  readonly isLoading = signal(false);
  readonly products = signal<LabelProduct[]>([]);
  readonly searchQuery = signal('');
  readonly showSettings = signal(false);

  readonly settings = signal<LabelPrintSettings>(this.loadSettings());

  readonly columnOptions = signal([
    { label: '1 Col', value: 1 },
    { label: '2 Col', value: 2 },
    { label: '3 Col', value: 3 },
    { label: '4 Col', value: 4 },
  ]);

  readonly filteredProducts = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(
      (p) => p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q)),
    );
  });

  readonly selectedProducts = computed(() => this.products().filter((p) => p.selected));

  readonly totalLabels = computed(() => this.selectedProducts().reduce((a, p) => a + p.copies, 0));

  readonly allSelected = computed(() => {
    const filtered = this.filteredProducts();
    return filtered.length > 0 && filtered.every((p) => p.selected);
  });

  private loadSettings(): LabelPrintSettings {
    const defaults: LabelPrintSettings = {
      columns: 1,
      fontSizeTitle: 14,
      fontSizeCode: 12,
      showPrice: true,
      showName: true,
      maxNameChars: 50,
      spacing: 10,
      labelWidth: 100,
      marginTop: 5,
      marginRight: 5,
      marginBottom: 5,
      marginLeft: 5,
      skipLabels: 0,
      alignEnd: true,
      savePaper: false,
    };

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch {
        // ignore
      }
    }
    return defaults;
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.tagsService.getAllProducts().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (!res.error && res.data) {
          const withoutBarcode = res.data.filter((p: Product) => !p.barcode).map(toLabelProduct);
          this.products.set(withoutBarcode);
        }
      },
      error: () => this.isLoading.set(false),
    });
  }

  toggleAll(): void {
    const newState = !this.allSelected();
    this.filteredProducts().forEach((p) => (p.selected = newState));
    this.products.set([...this.products()]);
  }

  generateEan13(id: number): string {
    const base = `200${String(id).padStart(9, '0')}`;
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(base[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const check = (10 - (sum % 10)) % 10;
    return base + check;
  }

  generateBarcode(product: LabelProduct): void {
    product.isGenerating = true;
    const barcode = this.generateEan13(product.id);

    this.tagsService.updateBarcode(product.id, barcode).subscribe({
      next: (res) => {
        product.isGenerating = false;
        if (!res.error) {
          product.generatedBarcode = barcode;
          product.barcode = barcode;
          product.isSaved = true;
          this.toast.success(`${product.name} → ${barcode}`);
        }
        this.products.set([...this.products()]);
      },
      error: () => {
        product.isGenerating = false;
      },
    });
  }

  generateAllSelected(): void {
    const pending = this.selectedProducts().filter((p) => !p.isSaved);
    if (!pending.length) return;

    pending.reduce((chain, product) => {
      return chain.then(() => this.generateBarcodeAsync(product));
    }, Promise.resolve());
  }

  private generateBarcodeAsync(product: LabelProduct): Promise<void> {
    return new Promise((resolve) => {
      product.isGenerating = true;
      const barcode = this.generateEan13(product.id);

      this.tagsService.updateBarcode(product.id, barcode).subscribe({
        next: (res) => {
          product.isGenerating = false;
          if (!res.error) {
            product.generatedBarcode = barcode;
            product.barcode = barcode;
            product.isSaved = true;
            this.toast.success(`${product.name} → ${barcode}`);
          }
          this.products.set([...this.products()]);
          resolve();
        },
        error: () => {
          product.isGenerating = false;
          resolve();
        },
      });
    });
  }

  openSettings(): void {
    const ready = this.selectedProducts().filter((p) => p.isSaved || p.generatedBarcode);
    if (!ready.length) {
      this.toast.error(this.translate.instant('LABELS.NO_BARCODE_SELECTED'));
      return;
    }
    this.showSettings.set(true);
  }

  print(): void {
    this.showSettings.set(false);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings()));
    this.openPrintWindow();
  }

  private truncateName(name: string, max = 35): string {
    return name.length > max ? name.substring(0, max) + '…' : name;
  }

  private openPrintWindow(): void {
    const ready = this.selectedProducts().filter((p) => p.isSaved || p.generatedBarcode);
    const s = this.settings();

    const items: { name: string; barcode: string; price: number; isPlaceholder?: boolean }[] = [];

    if (s.skipLabels > 0) {
      for (let i = 0; i < s.skipLabels; i++) {
        items.push({ name: '', barcode: '', price: 0, isPlaceholder: true });
      }
    }

    for (const p of ready) {
      const copies = Math.max(1, Math.floor(Number(p.copies) || 1));
      for (let i = 0; i < copies; i++) {
        items.push({
          name: this.truncateName(p.name, s.maxNameChars),
          barcode: p.generatedBarcode ?? p.barcode ?? '',
          price: p.sale_price,
        });
      }
    }

    const win = window.open('', '_blank', 'width=800,height=600');
    if (!win) return;

    const gridCols = `repeat(${s.columns}, 1fr)`;

    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Print Labels</title>
  <style>
    @page { margin: 0; size: auto; }
    body { margin: 0; font-family: Arial, sans-serif; background: #eee; padding: 20px; }
    .grid {
      display: grid;
      grid-template-columns: ${gridCols};
      gap: ${s.spacing}px;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
      background: #fff;
      padding: ${s.marginTop}px ${s.marginRight}px ${s.marginBottom}px ${s.marginLeft}px;
      box-sizing: border-box;
      ${s.savePaper ? 'min-height: auto;' : s.alignEnd ? 'align-content: end; min-height: 97vh;' : ''}
    }
    .label {
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      border: 1px solid #eee; padding: 10px; box-sizing: border-box; text-align: center; overflow: hidden;
    }
    .name { font-size: ${s.fontSizeTitle}px; font-weight: bold; margin-bottom: 5px; width: 100%; word-wrap: break-word; }
    .bc-wrap { width: ${s.labelWidth}%; margin: 5px 0; }
    .bc-img { width: 100%; height: auto; }
    .code-text { font-size: ${s.fontSizeCode}px; font-family: "Courier New", monospace; margin-top: 2px; }
    .price { font-size: ${s.fontSizeTitle + 2}px; font-weight: 800; margin-top: 5px; color: #000; }
    @media print {
      body { padding: 0; background: #fff; }
      .grid { border: none; max-width: none; }
      .label { border: none; page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="grid" id="labels"></div>
  <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"><\/script>
  <script>
    const items = ${JSON.stringify(items)};
    const cfg = ${JSON.stringify({ ...s, savePaper: undefined, alignEnd: undefined })};
    const container = document.getElementById('labels');

    items.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'label';
      if (item.isPlaceholder) { div.style.border = 'none'; container.appendChild(div); return; }
      if (cfg.showName) {
        const n = document.createElement('div');
        n.className = 'name'; n.innerText = item.name; div.appendChild(n);
      }
      if (cfg.showPrice) {
        const pr = document.createElement('div');
        pr.className = 'price';
        pr.innerText = '$' + new Intl.NumberFormat('es-CO').format(item.price);
        div.appendChild(pr);
      }
      const wrap = document.createElement('div');
      wrap.className = 'bc-wrap';
      const cvs = document.createElement('canvas');
      cvs.id = 'bc-' + i; cvs.className = 'bc-img';
      wrap.appendChild(cvs); div.appendChild(wrap);
      const ct = document.createElement('div');
      ct.className = 'code-text'; ct.innerText = item.barcode; div.appendChild(ct);
      container.appendChild(div);
      try { JsBarcode('#bc-' + i, item.barcode, { format: 'EAN13', width: 2, height: 50, displayValue: false, margin: 0 }); } catch(e) {}
    });

    window.onload = function() {
      if (${s.savePaper}) {
        const h = container.offsetHeight;
        const st = document.createElement('style');
        st.innerHTML = '@page { size: auto ' + h + 'px; margin: 0; }';
        document.head.appendChild(st);
      }
      setTimeout(() => window.print(), 500);
    };
  <\/script>
</body>
</html>`);
    win.document.close();
  }
}

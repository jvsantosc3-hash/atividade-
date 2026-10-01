import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { CNAE_CATALOG, CNAE_SECTORS } from '../data/cnaeCatalog';
import {
  BRAZILIAN_CITIES,
  CityPreset,
  GeocodedCompany,
  searchCompaniesByRadiusAndCNAE,
} from '../data/geocodedCompanies';
import {
  MapPin,
  Search,
  Navigation,
  Compass,
  Sliders,
  Building2,
  ExternalLink,
  Download,
  Filter,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  Layers,
} from 'lucide-react';
import { formatCNPJ } from '../utils/cnpjUtils';

interface CnaeRadiusMapProps {
  onConsultCNPJ: (cnpj: string) => void;
}

export const CnaeRadiusMap: React.FC<CnaeRadiusMapProps> = ({ onConsultCNPJ }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleLayerRef = useRef<L.Circle | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  // Estados de busca
  const [centerCoords, setCenterCoords] = useState<{ lat: number; lng: number }>({
    lat: -23.5505,
    lng: -46.6333, // São Paulo por padrão
  });
  const [selectedCityName, setSelectedCityName] = useState<string>('São Paulo (SP)');
  const [radiusKm, setRadiusKm] = useState<number>(15);
  const [cnaeQuery, setCnaeQuery] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('Todos os Setores');
  const [onlySimples, setOnlySimples] = useState<boolean>(false);
  const [onlyActive, setOnlyActive] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [showCnaeDropdown, setShowCnaeDropdown] = useState<boolean>(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Lista de empresas encontradas
  const [companies, setCompanies] = useState<GeocodedCompany[]>([]);

  // Inicializa o Mapa Leaflet
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerCoords.lat, centerCoords.lng],
      zoom: 12,
      zoomControl: true,
    });

    // Camada OpenStreetMap padrão com boa resolução
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);

    // Ícone do Centro (Radar Pin)
    const centerIcon = L.divIcon({
      className: 'custom-radar-center-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 28px; height: 28px; background: rgba(19, 81, 180, 0.25); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: relative; width: 16px; height: 16px; background: #071D41; border: 3px solid #FFFFFF; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    const marker = L.marker([centerCoords.lat, centerCoords.lng], {
      icon: centerIcon,
      draggable: true,
    }).addTo(map);

    marker.bindTooltip('Centro do Raio de Busca (Arraste para mover)', {
      permanent: false,
      direction: 'top',
    });

    marker.on('dragend', (e) => {
      const newPos = e.target.getLatLng();
      setCenterCoords({ lat: newPos.lat, lng: newPos.lng });
      setSelectedCityName('Ponto Personalizado no Mapa');
    });

    centerMarkerRef.current = marker;

    // Círculo de Raio
    const circle = L.circle([centerCoords.lat, centerCoords.lng], {
      radius: radiusKm * 1000,
      color: '#1351B4',
      weight: 1.5,
      fillColor: '#1351B4',
      fillOpacity: 0.1,
    }).addTo(map);

    circleLayerRef.current = circle;

    // Clique no mapa move o centro do raio
    map.on('click', (e: L.LeafletMouseEvent) => {
      setCenterCoords({ lat: e.latlng.lat, lng: e.latlng.lng });
      setSelectedCityName('Ponto Selecionado no Mapa');
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Atualiza posição do centro e círculo quando as coordenadas ou o raio mudam
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([centerCoords.lat, centerCoords.lng]);
    }

    if (circleLayerRef.current) {
      circleLayerRef.current.setLatLng([centerCoords.lat, centerCoords.lng]);
      circleLayerRef.current.setRadius(radiusKm * 1000);
    }

    // Recalcula as empresas no raio
    const results = searchCompaniesByRadiusAndCNAE(centerCoords.lat, centerCoords.lng, radiusKm, {
      cnaeQuery,
      sectorFilter: selectedSector,
      onlySimples,
      onlyActive,
    });
    setCompanies(results);

    // Ajusta visualização do mapa para englobar o círculo
    if (circleLayerRef.current) {
      mapInstanceRef.current.fitBounds(circleLayerRef.current.getBounds(), {
        padding: [30, 30],
        maxZoom: 14,
      });
    }
  }, [centerCoords, radiusKm, cnaeQuery, selectedSector, onlySimples, onlyActive]);

  // Atualiza marcadores de empresas no mapa
  useEffect(() => {
    if (!mapInstanceRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();

    companies.forEach((company) => {
      const isSelected = selectedCompanyId === company.cnpj;
      const markerColor =
        company.setor === 'Tecnologia da Informação'
          ? '#2563EB'
          : company.setor === 'Serviços Financeiros'
          ? '#059669'
          : company.setor === 'Alimentação'
          ? '#D97706'
          : company.setor === 'Saúde'
          ? '#DC2626'
          : '#475569';

      const companyIcon = L.divIcon({
        className: 'company-pin',
        html: `
          <div style="background: ${markerColor}; color: white; width: ${
          isSelected ? '32px' : '26px'
        }; height: ${
          isSelected ? '32px' : '26px'
        }; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3); font-size: 11px; font-weight: bold; cursor: pointer; transition: transform 0.2s;">
            <span>🏢</span>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const m = L.marker([company.lat, company.lng], { icon: companyIcon });

      const popupHtml = `
        <div style="font-family: inherit; min-width: 220px; font-size: 12px; color: #1e293b;">
          <div style="font-size: 10px; font-weight: bold; color: ${markerColor}; text-transform: uppercase; margin-bottom: 2px;">
            ${company.setor} · ${company.distanceKm} km
          </div>
          <strong style="font-size: 13px; display: block; color: #0f172a; margin-bottom: 2px; line-height: 1.2;">
            ${company.nome_fantasia || company.razao_social}
          </strong>
          <div style="font-family: monospace; font-size: 11px; color: #64748b; margin-bottom: 4px;">
            CNPJ: ${company.cnpj_formatado}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 4px;">
            <strong>CNAE:</strong> ${company.cnae_codigo} - ${company.cnae_descricao}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
            ${company.logradouro}, ${company.numero} - ${company.municipio}/${company.uf}
          </div>
          <button id="popup-btn-${company.cnpj}" style="width: 100%; background: #071D41; color: white; font-weight: bold; font-size: 11px; padding: 6px 10px; border-radius: 6px; border: none; cursor: pointer;">
            Consultar Ficha & Certidão RFB →
          </button>
        </div>
      `;

      m.bindPopup(popupHtml);

      m.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${company.cnpj}`);
        if (btn) {
          btn.onclick = () => onConsultCNPJ(company.cnpj);
        }
        setSelectedCompanyId(company.cnpj);
      });

      markersGroupRef.current?.addLayer(m);
    });
  }, [companies, selectedCompanyId]);

  // Ação de Localização GPS
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocalização não é suportada pelo seu navegador.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        setCenterCoords({ lat: latitude, lng: longitude });
        setSelectedCityName('Sua Localização GPS Atual');

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([latitude, longitude], 13);
        }
      },
      (error) => {
        setIsLocating(false);
        console.warn('Erro ao obter localização:', error);
        alert('Não foi possível obter a sua localização GPS atual. Verifique as permissões do navegador.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectCity = (city: CityPreset) => {
    setCenterCoords({ lat: city.lat, lng: city.lng });
    setSelectedCityName(`${city.name} (${city.uf})`);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([city.lat, city.lng], 13);
    }
  };

  const handleSelectCnaePreset = (cnaeCode: string, cnaeDesc: string) => {
    setCnaeQuery(cnaeCode);
    setShowCnaeDropdown(false);
  };

  const handleExportCSV = () => {
    if (companies.length === 0) return;
    const headers = ['CNPJ', 'Razao Social', 'Nome Fantasia', 'CNAE Codigo', 'CNAE Descricao', 'Setor', 'Distancia KM', 'Municipio', 'UF'];
    const rows = companies.map((c) => [
      c.cnpj,
      `"${c.razao_social.replace(/"/g, '""')}"`,
      `"${c.nome_fantasia.replace(/"/g, '""')}"`,
      c.cnae_codigo,
      `"${c.cnae_descricao.replace(/"/g, '""')}"`,
      c.setor,
      c.distanceKm,
      `"${c.municipio}"`,
      c.uf,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `empresas_raio_${radiusKm}km_cnae.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sugestões de CNAE filtradas
  const filteredCnaes = CNAE_CATALOG.filter((item) => {
    if (!cnaeQuery) return true;
    const q = cnaeQuery.toLowerCase();
    return (
      item.codigo.toLowerCase().includes(q) ||
      item.descricao.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    );
  }).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Banner de Apresentação */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-blue-50 border border-blue-200/80 rounded-full text-xs text-blue-800 font-semibold mb-1">
              <Compass className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
              <span>Radar Geográfico de CNPJs & Atividades Econômicas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Busca de CNPJ por CNAE e Raio Geográfico
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Localize estabelecimentos empresariais ativos em um raio de até 100 km com base no código
              de atividade econômica (CNAE), setor ou geolocalização. Clique em qualquer resultado para consultar
              dados oficiais na BrasilAPI e emitir a certidão cadastral.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUseMyLocation}
              disabled={isLocating}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-300 shadow-xs whitespace-nowrap"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin text-blue-600' : 'text-slate-600'}`} />
              <span>{isLocating ? 'Obtendo GPS...' : 'Usar Meu GPS'}</span>
            </button>
          </div>
        </div>

        {/* Filtros em Linha: CNAE, Setor, Cidades Rápidas e Slider de Raio */}
        <div className="mt-5 pt-5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Campo de Busca por CNAE com Autocomplete */}
          <div className="md:col-span-4 relative">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Atividade Econômica / CNAE
            </label>
            <div className="relative">
              <input
                type="text"
                value={cnaeQuery}
                onChange={(e) => {
                  setCnaeQuery(e.target.value);
                  setShowCnaeDropdown(true);
                }}
                onFocus={() => setShowCnaeDropdown(true)}
                placeholder="Ex: 6201, Software, Restaurante, Farmácia..."
                className="w-full pl-8 pr-3 py-2 text-xs font-medium border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>

            {/* Dropdown de sugestões de CNAE */}
            {showCnaeDropdown && filteredCnaes.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y divide-slate-100 text-xs">
                {filteredCnaes.map((cnae) => (
                  <button
                    key={cnae.codigo}
                    type="button"
                    onClick={() => handleSelectCnaePreset(cnae.codigo, cnae.descricao)}
                    className="w-full text-left p-2.5 hover:bg-blue-50 transition-colors flex flex-col"
                  >
                    <div className="flex items-center justify-between font-mono font-bold text-blue-900">
                      <span>{cnae.codigo}</span>
                      <span className="text-[10px] text-slate-400 font-sans font-normal">{cnae.setor}</span>
                    </div>
                    <span className="text-slate-600 truncate mt-0.5">{cnae.descricao}</span>
                  </button>
                ))}
                <div className="p-1.5 text-[10px] text-center text-slate-400 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowCnaeDropdown(false)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    Fechar sugestões
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Seletor de Setor Econômico */}
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Setor Econômico
            </label>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full px-2.5 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CNAE_SECTORS.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Slider de Raio em KM */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Raio de Busca no Mapa: <strong className="text-blue-700 font-mono">{radiusKm} km</strong>
              </label>
              <div className="flex gap-1">
                {[5, 15, 30, 50].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRadiusKm(r)}
                    className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                      radiusKm === r ? 'bg-[#071D41] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}km
                  </button>
                ))}
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="100"
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full mt-2 accent-[#1351B4] cursor-pointer"
            />
          </div>
        </div>

        {/* Cidades de Atalho e Filtros Booleans */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-semibold text-[11px] uppercase mr-1">
              Capitais / Regiões:
            </span>
            {BRAZILIAN_CITIES.slice(0, 8).map((city) => (
              <button
                key={city.name}
                type="button"
                onClick={() => handleSelectCity(city)}
                className={`px-2 py-0.5 text-[11px] rounded transition-colors ${
                  selectedCityName.includes(city.name)
                    ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlyActive}
                onChange={(e) => setOnlyActive(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Apenas CNPJ Ativo</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={onlySimples}
                onChange={(e) => setOnlySimples(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span>Simples Nacional</span>
            </label>
          </div>
        </div>
      </div>

      {/* Grid: Mapa Interativo (Esquerda) e Lista de Resultados (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna 1: Mapa Interativo com Leaflet */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="font-semibold text-slate-800">
                Ponto Central: <strong>{selectedCityName}</strong> (Raio: {radiusKm} km)
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Clique em qualquer ponto do mapa para reposicionar o radar
            </span>
          </div>

          {/* Elemento do Mapa Leaflet */}
          <div ref={mapContainerRef} className="w-full h-[520px] relative z-10" />

          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#071D41] border border-white"></div>
                <span>Centro do Radar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#1351B4]"></div>
                <span>Área de Cobertura ({radiusKm} km)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#2563EB]"></div>
                <span>Estabelecimentos Localizados</span>
              </div>
            </div>
            <span>{companies.length} empresas no raio</span>
          </div>
        </div>

        {/* Coluna 2: Lista de Estabelecimentos Encontrados */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col h-[585px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Empresas no Raio ({companies.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Ordenadas por distância do centro
              </p>
            </div>

            {companies.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 flex items-center gap-1 transition-colors"
                title="Exportar listagem para planilha CSV"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>CSV</span>
              </button>
            )}
          </div>

          {/* Lista com Rolagem */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1 mt-2">
            {companies.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                <p className="font-semibold text-xs text-slate-700">Nenhuma empresa encontrada neste raio.</p>
                <p className="text-[11px] text-slate-500">
                  Tente aumentar o raio de busca ou remover o filtro de CNAE específico.
                </p>
              </div>
            ) : (
              companies.map((company) => (
                <div
                  key={company.cnpj}
                  className={`py-3 px-2 rounded-lg transition-colors cursor-pointer ${
                    selectedCompanyId === company.cnpj ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-50'
                  }`}
                  onClick={() => {
                    setSelectedCompanyId(company.cnpj);
                    if (mapInstanceRef.current) {
                      mapInstanceRef.current.setView([company.lat, company.lng], 14);
                    }
                  }}
                >
                  <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                    <span className="font-bold text-blue-700 uppercase tracking-tight">
                      {company.setor}
                    </span>
                    <span className="font-mono font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">
                      {company.distanceKm} km
                    </span>
                  </div>

                  <strong className="block text-xs font-bold text-slate-900 leading-tight">
                    {company.nome_fantasia || company.razao_social}
                  </strong>

                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {company.cnpj_formatado}
                  </div>

                  <div className="text-[11px] text-slate-600 line-clamp-1 mt-1">
                    <span className="font-mono font-semibold">{company.cnae_codigo}</span> - {company.cnae_descricao}
                  </div>

                  <div className="text-[10.5px] text-slate-500 mt-0.5 truncate">
                    {company.logradouro}, {company.numero} - {company.municipio}/{company.uf}
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      {company.situacao_cadastral}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onConsultCNPJ(company.cnpj);
                      }}
                      className="px-2.5 py-1 bg-[#071D41] hover:bg-[#1351B4] text-white text-[10px] font-bold rounded flex items-center gap-1 transition-colors"
                    >
                      <span>Consultar Ficha</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

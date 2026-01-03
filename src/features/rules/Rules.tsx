import {
  VStack,
  HStack,
  Button,
  Heading,
  Card,
  CardBody,
  Input,
  Textarea,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  useColorModeValue,
  Box,
  Grid,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Select,
  Text,
  Divider,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon, EditIcon, StarIcon } from '@chakra-ui/icons'
import { useState, useMemo } from 'react'
import { useRuleStore } from '@context/store'
import type { Rule } from '../../types'
import { v4 as uuidv4 } from 'uuid'

export default function Rules() {
  const { rules, addRule, updateRule, deleteRule } = useRuleStore()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [formData, setFormData] = useState({ title: '', description: '', category: '' })
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false)
  const [newStrategyName, setNewStrategyName] = useState('')

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const cardBg = useColorModeValue('gray.50', 'gray.700')

  // Stratejileri ve Genel Kuralları Grupla
  const { strategies, generalRules } = useMemo(() => {
    const general: Rule[] = []
    const strategyMap = new Map<string, Rule[]>()

    rules.forEach(rule => {
      if (!rule.category || rule.category === 'General') {
        general.push(rule)
      } else {
        if (!strategyMap.has(rule.category)) {
          strategyMap.set(rule.category, [])
        }
        strategyMap.get(rule.category)?.push(rule)
      }
    })

    return {
      strategies: Array.from(strategyMap.entries()),
      generalRules: general
    }
  }, [rules])

  const handleOpen = (rule?: Rule, defaultCategory?: string) => {
    if (rule) {
      setEditingRule(rule)
      setFormData({ 
        title: rule.title, 
        description: rule.description, 
        category: rule.category || 'General' 
      })
    } else {
      setEditingRule(null)
      setFormData({ 
        title: '', 
        description: '', 
        category: defaultCategory || 'General' 
      })
    }
    onOpen()
  }

  const handleSave = () => {
    if (!formData.title.trim()) return

    const category = formData.category === 'General' ? undefined : formData.category

    if (editingRule) {
      updateRule(editingRule.id, {
        title: formData.title,
        description: formData.description,
        category: category,
      })
    } else {
      const newRule: Rule = {
        id: uuidv4(),
        title: formData.title,
        description: formData.description,
        category: category,
        isPinned: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addRule(newRule)
    }

    onClose()
    setFormData({ title: '', description: '', category: '' })
  }

  const handleCreateStrategy = () => {
    if (!newStrategyName.trim()) return
    // Strateji oluşturmak için dummy bir kural ekleyebiliriz veya sadece UI'da gösterebiliriz.
    // Ancak kalıcı olması için bir kural eklemek en iyisi.
    // Kullanıcıya "Strateji oluşturuldu, şimdi ilk kuralı ekleyin" diyebiliriz.
    // Veya doğrudan kural ekleme modalını açıp kategoriyi set edebiliriz.
    
    setFormData({ title: '', description: '', category: newStrategyName })
    setEditingRule(null)
    setIsStrategyModalOpen(false)
    setNewStrategyName('')
    onOpen()
  }

  const handleTogglePin = (rule: Rule) => {
    updateRule(rule.id, { isPinned: !rule.isPinned })
  }

  const RuleCard = ({ rule }: { rule: Rule }) => (
    <Card
      bg={rule.isPinned ? cardBg : bgColor}
      borderColor={rule.isPinned ? 'yellow.500' : borderColor}
      borderWidth={rule.isPinned ? '2px' : '1px'}
      shadow="sm"
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Heading size="sm" noOfLines={1}>{rule.title}</Heading>
            <HStack spacing={1}>
              <IconButton
                aria-label="Sabitle"
                icon={<StarIcon />}
                size="xs"
                colorScheme={rule.isPinned ? 'yellow' : 'gray'}
                variant={rule.isPinned ? 'solid' : 'ghost'}
                onClick={(e) => { e.stopPropagation(); handleTogglePin(rule); }}
              />
              <IconButton
                aria-label="Düzenle"
                icon={<EditIcon />}
                size="xs"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); handleOpen(rule); }}
              />
              <IconButton
                aria-label="Sil"
                icon={<DeleteIcon />}
                size="xs"
                colorScheme="red"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); deleteRule(rule.id); }}
              />
            </HStack>
          </HStack>
          <Text fontSize="sm" color="gray.500" noOfLines={3}>
            {rule.description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Heading>🌟 Trading Kuralları</Heading>
        <Button
          leftIcon={<AddIcon />}
          colorScheme="brand"
          onClick={() => setIsStrategyModalOpen(true)}
        >
          Yeni Strateji Ekle
        </Button>
      </HStack>

      {/* Stratejiler Listesi */}
      <Accordion allowMultiple defaultIndex={[0]}>
        {strategies.map(([strategyName, strategyRules]) => (
          <AccordionItem key={strategyName} border="none" mb={4}>
            <h2>
              <AccordionButton 
                bg={useColorModeValue('white', 'gray.700')} 
                _hover={{ bg: useColorModeValue('gray.50', 'gray.600') }}
                p={4} 
                borderRadius="md"
                shadow="sm"
              >
                <Box flex="1" textAlign="left">
                  <Heading size="md">{strategyName}</Heading>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {strategyRules.length} Kural
                  </Text>
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <VStack align="stretch" spacing={4} mt={2}>
                <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
                  {strategyRules.map(rule => (
                    <RuleCard key={rule.id} rule={rule} />
                  ))}
                  
                  {/* Yeni Kural Ekle Kartı */}
                  <Button
                    height="auto"
                    minH="150px"
                    variant="outline"
                    borderStyle="dashed"
                    onClick={() => handleOpen(undefined, strategyName)}
                    flexDirection="column"
                    gap={2}
                  >
                    <AddIcon boxSize={6} />
                    <Text>Bu Stratejiye Kural Ekle</Text>
                  </Button>
                </Grid>
              </VStack>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>

      <Divider />

      {/* Genel Kurallar */}
      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading size="lg">Genel Kurallar</Heading>
          <Button
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => handleOpen(undefined, 'General')}
          >
            Genel Kural Ekle
          </Button>
        </HStack>
        
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
          {generalRules.map(rule => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
          {generalRules.length === 0 && (
            <Text color="gray.500">Henüz genel kural eklenmedi.</Text>
          )}
        </Grid>
      </Box>

      {/* Kural Ekleme/Düzenleme Modalı */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingRule ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Kategori / Strateji</FormLabel>
                <Select 
                  value={formData.category} 
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="General">Genel Kurallar</option>
                  {strategies.map(([name]) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                  {/* Eğer yeni bir strateji ismi ile geldiysek onu da ekle */}
                  {formData.category && formData.category !== 'General' && !strategies.find(s => s[0] === formData.category) && (
                    <option value={formData.category}>{formData.category}</option>
                  )}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Kural Başlığı</FormLabel>
                <Input
                  placeholder="Örn: %2 Stop Loss"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Açıklama</FormLabel>
                <Textarea
                  placeholder="Kuralın detayları..."
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  minH="120px"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              İptal
            </Button>
            <Button colorScheme="brand" onClick={handleSave}>
              Kaydet
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Yeni Strateji Modalı */}
      <Modal isOpen={isStrategyModalOpen} onClose={() => setIsStrategyModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Yeni Strateji Oluştur</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Strateji Adı</FormLabel>
              <Input
                placeholder="Örn: Darvas Box, Trend Follower..."
                value={newStrategyName}
                onChange={e => setNewStrategyName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreateStrategy()
                }}
              />
              <Text fontSize="sm" color="gray.500" mt={2}>
                Strateji oluşturulduktan sonra içine ilk kuralınızı eklemeniz gerekecektir.
              </Text>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={() => setIsStrategyModalOpen(false)}>
              İptal
            </Button>
            <Button colorScheme="brand" onClick={handleCreateStrategy}>
              Devam Et
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
